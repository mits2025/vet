<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule)
    {
        // Delete rejected vendors after 5 days
        $schedule->call(function () {
            \App\Models\Vendor::where('status', 'rejected')
                ->where('updated_at', '<', now()->subDays(5)) // 5 days check
                ->delete();
        })->daily(); // Runs daily
    }

    /**
     * Register the commands for the application.
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}
