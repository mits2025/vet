<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Enum\ProductVariationTypeEnum;
use App\Filament\Resources\ProductResource;
use Filament\Actions;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Pages\EditRecord;

class ProductVariationTypes extends EditRecord
{
    protected static string $resource = ProductResource::class;

    protected static ?string $navigationIcon = 'heroicon-m-numbered-list';

    protected static ?string $title = 'Product Variation Types';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Repeater::make('variationTypes')
                    ->relationship()
                    ->collapsible()
                    ->defaultItems(1)
                    ->addActionLabel('Add new variation type')
                    ->columns(2) // Adjust columns for better balance
                    ->columnSpanFull() // Make the whole repeater fit the container
                    ->schema([
                        TextInput::make('name')
                            ->label('Variation Name')
                            ->required(),
                        Select::make('type')
                            ->label('Variation Type')
                            ->options(ProductVariationTypeEnum::labels())
                            ->required(),
                        Repeater::make('options')
                            ->relationship()
                            ->collapsible()
                            ->columns(1) // Stack fields for better alignment
                            ->schema([
                                TextInput::make('name')
                                    ->label('Option Name')
                                    ->required()
                                    ->columnSpanFull(),
                                SpatieMediaLibraryFileUpload::make('images')
                                    ->image()
                                    ->multiple()
                                    ->openable()
                                    ->panelLayout('grid')
                                    ->collection('images')
                                    ->reorderable()
                                    ->appendFiles()
                                    ->preserveFilenames()
                                    ->columnSpanFull(), // Ensure the file upload takes full width
                            ])
                            ->columnSpan(2) // Fit the options within the repeater
                            ->defaultItems(1), // Always include one option by default
                    ]),
            ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
