<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\Resources\ProductResource;
use Filament\Actions;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Form;
use Filament\Resources\Pages\EditRecord;

class ProductImages extends EditRecord
{
    protected static string $resource = ProductResource::class;
    Protected static ?string $title = 'Product Images';

    protected static ?string $navigationIcon= 'heroicon-c-photo';
    public function form(Form $form): Form
    {
        return $form
            ->schema([
                SpatieMediaLibraryFileUpload::make('images')
                ->image()
                ->multiple()
                ->openable()
                ->panelLayout('grid')
                ->collection('images')
                ->reorderable()
                ->appendFiles()
                ->columnSpan(20)
            ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
