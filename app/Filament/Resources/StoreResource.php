<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StoreResource\Pages;
use App\Filament\Resources\StoreResource\RelationManagers;
use App\Models\Vendor;
use Filament\Forms;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use App\Enum\VendorStatusEnum;
use Illuminate\Support\Facades\Auth;

class StoreResource extends Resource
{
    protected static ?string $model = Vendor::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-storefront';
    protected static ?string $navigationLabel = 'Store';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Basic Information')
                    ->schema([
                        TextInput::make('store_name')
                            ->required()
                            ->maxLength(255),

                        FileUpload::make('profile_image')
                            ->image()
                            ->directory('vendor-images')
                            ->imageEditor(),

                        FileUpload::make('cover _image')
                            ->image()
                            ->directory('vendor-images')
                            ->imageEditor(),


                        TextInput::make('address')
                            ->label('Store Address')
                            ->required()
                            ->maxLength(255),

                        TextInput::make('phone')
                            ->tel()
                            ->required()
                            ->maxLength(20),

                        TextInput::make('email')
                            ->email()
                            ->required()
                            ->maxLength(255),

                        Forms\Components\RichEditor::make('description')
                            ->label('About Us Description')
                            ->required()
                            ->toolbarButtons([
                                'blockquote',
                                'bulletList',
                                'h2',
                                'h3',
                                'italic',
                                'link',
                                'orderedList',
                                'redo',
                                'strike',
                                'underline',
                                'undo',
                                'table',
                            ])
                        ->maxLength(1000)
                    ]),

                Section::make('Opening Hours')
                    ->schema([
                        Repeater::make('opening_hours')
                            ->schema([
                                Select::make('day')
                                    ->options([
                                        'Monday' => 'Monday',
                                        'Tuesday' => 'Tuesday',
                                        'Wednesday' => 'Wednesday',
                                        'Thursday' => 'Thursday',
                                        'Friday' => 'Friday',
                                        'Saturday' => 'Saturday',
                                        'Sunday' => 'Sunday',
                                    ])
                                    ->required(),

                                TextInput::make('open')
                                    ->type('time')
                                    ->required(),

                                TextInput::make('close')
                                    ->type('time')
                                    ->required(),
                            ])
                            ->columns(3)
                            ->defaultItems(0)
                            ->reorderable(false)
                            ->columnSpanFull(),
                    ]),

                Section::make('Social Media')
                    ->schema([
                        Repeater::make('social_media_links')
                            ->schema([
                                Select::make('platform')
                                    ->options([
                                        'facebook' => 'Facebook',
                                        'instagram' => 'Instagram',
                                        'twitter' => 'Twitter',
                                    ])
                                    ->required(),

                                TextInput::make('url')
                                    ->url()
                                    ->required()
                                    ->prefix('https://'),
                            ])
                            ->columns(2)
                            ->defaultItems(0)
                            ->columnSpanFull(),
                    ]),

                Select::make('availability')
                    ->options([
                        'available' => 'In Service',
                        'out' => 'Out of Service',
                    ]),

            ]);
    }



    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('availability')
                    ->badge()
                    ->color(fn ($state): string => $state === 'out' ? 'danger' : 'success'),
                TextColumn::make('store_name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('address')
                    ->searchable(),
                TextColumn::make('email')
                    ->searchable(),
                TextColumn::make('phone')
                    ->searchable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        VendorStatusEnum::Pending->value => 'Pending',
                        VendorStatusEnum::Approved->value => 'Approved',
                        VendorStatusEnum::Rejected->value => 'Rejected',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListStores::route('/'),
            'create' => Pages\CreateStore::route('/create'),
            'edit' => Pages\EditStore::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where('user_id', Auth::id());
    }

    public static function canCreate(): bool
    {
        return !Vendor::where('user_id', Auth::id())->exists();
    }
}
