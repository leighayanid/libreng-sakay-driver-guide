<?php
/**
 * Puts the e2e database into the exact state the deck's screenshots assume:
 * one bus, BS-001, running MU-ABU-IN with Juan Dela Cruz and a live kiosk,
 * plus a dispatch thread for the messages shot.
 *
 * Deck demo data: BS-001 · BTA 1001 · MU-ABU-IN Abucay - Capitol.
 */

use App\Enums\AssignmentStatus;
use App\Enums\ConversationStatus;
use App\Enums\ConversationType;
use App\Enums\KioskStatus;
use App\Enums\LocationSource;
use App\Enums\MessageType;
use App\Enums\ParticipantRole;
use App\Enums\TripStatus;
use App\Models\Bus;
use App\Models\BusAssignment;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Driver;
use App\Models\KioskDevice;
use App\Models\Message;
use App\Models\RouteStop;
use App\Models\TransitRoute;
use App\Models\Trip;
use App\Models\User;
use Illuminate\Support\Str;

$route = TransitRoute::where('code', 'MU-ABU-IN')->firstOrFail();
$stops = RouteStop::where('transit_route_id', $route->id)->orderBy('stop_order')->get();

$driverUser = User::where('email', 'juan.delacruz@driver.librengsakay.test')->firstOrFail();
$driver = Driver::where('user_id', $driverUser->id)->firstOrFail();
$bus = Bus::where('bus_no', 'BS-001')->first() ?? Bus::query()->orderBy('id')->firstOrFail();
$dispatcher = User::where('email', 'superadmin@e2e.test')->firstOrFail();

// The e2e account is named for the test suite; the deck shows it to drivers.
$dispatcher->forceFill(['name' => 'Dispatch'])->save();

// One trip only — clear what E2eActiveTripSeeder left behind.
Trip::query()->delete();
BusAssignment::query()->delete();
KioskDevice::query()->delete();

$assignment = BusAssignment::create([
    'bus_id' => $bus->id,
    'driver_id' => $driver->id,
    'transit_route_id' => $route->id,
    'assigned_by_user_id' => $dispatcher->id,
    'shift_starts_at' => now()->subMinutes(30),
    'shift_ends_at' => now()->addHours(8),
    'status' => AssignmentStatus::Active,
    'system_check_passed' => true,
]);

// Parked on the first stop with nothing departed yet, so the next action the
// cockpit offers is "Depart <stop>" — the state the undo shot starts from.
$trip = Trip::create([
    'bus_assignment_id' => $assignment->id,
    'bus_id' => $bus->id,
    'driver_id' => $driver->id,
    'transit_route_id' => $route->id,
    'current_stop_id' => $stops[0]->id,
    'next_stop_id' => $stops[1]->id,
    'status' => TripStatus::Active,
    'started_at' => now()->subMinutes(4),
    'latest_latitude' => $stops[0]->latitude,
    'latest_longitude' => $stops[0]->longitude,
    'latest_location_source' => LocationSource::Gps,
    'located_at' => now(),
    'delay_minutes' => 0,
]);

$trip->forceFill(['boarding_count' => 12, 'alighting_count' => 0])->save();

// The driver app refuses to start a trip without a live kiosk, and the
// occupancy chip reads from it.
KioskDevice::create([
    'uuid' => (string) Str::uuid(),
    'bus_id' => $bus->id,
    'name' => 'Kiosk',
    'device_label' => 'Front door reader',
    'status' => KioskStatus::Active->value,
    'enrolled_at' => now()->subDays(3),
    'last_seen_at' => now(),
]);

// A dispatch thread with unread history, for the reply/mute shot.
Conversation::query()->delete();

$convo = Conversation::create([
    'uuid' => (string) Str::uuid(),
    'type' => ConversationType::Trip,
    'subject' => 'Trapiko sa Capitol',
    'transit_route_id' => $route->id,
    'status' => ConversationStatus::Open,
    'created_by' => $dispatcher->id,
    'last_message_at' => now()->subMinutes(2),
]);

foreach ([[$dispatcher->id, ParticipantRole::Dispatcher], [$driverUser->id, ParticipantRole::Driver]] as [$uid, $role]) {
    ConversationParticipant::create([
        'conversation_id' => $convo->id,
        'user_id' => $uid,
        'role' => $role,
    ]);
}

$thread = [
    [$dispatcher->id, 'Heads up — may roadworks sa Capitol approach.', 9],
    [$dispatcher->id, 'Dumaan kayo sa Gabon, mga 5 minuto lang dagdag.', 8],
    [$driverUser->id, 'Copy po, papunta na kami sa Gabon.', 3],
    [$dispatcher->id, 'Salamat. I-update mo ako pagdating sa Capitol.', 2],
];

foreach ($thread as [$sender, $body, $agoMin]) {
    Message::create([
        'uuid' => (string) Str::uuid(),
        'conversation_id' => $convo->id,
        'sender_id' => $sender,
        'client_uuid' => (string) Str::uuid(),
        'type' => MessageType::Text,
        'body' => $body,
        'sent_at' => now()->subMinutes($agoMin),
    ]);
}

echo 'OK trip='.$trip->id.' bus='.$bus->bus_no.' route='.$route->code
    .' stop1='.$stops[0]->name.' convo='.$convo->id.PHP_EOL;
