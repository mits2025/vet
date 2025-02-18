<?php

namespace App\Filament\Resources\StoreResource\Pages;

use App\Filament\Resources\StoreResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditStore extends EditRecord
{
    protected static ?string $title = 'Edit Store Info';
    protected static string $resource = StoreResource::class;

    protected function getHeaderActions(): array
    {
        return [

        ];
    }
}
