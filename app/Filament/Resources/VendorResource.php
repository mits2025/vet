<?php

namespace App\Filament\Resources;

use App\Enum\RolesEnum;
use App\Enum\VendorStatusEnum;
use App\Enum\ProductStatusEnum;
use App\Filament\Resources\VendorResource\Pages\EditVendor;
use App\Filament\Resources\VendorResource\Pages\ListVendors;
use App\Models\Vendor;
use Filament\Facades\Filament;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Forms;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Filament\Forms\Form;

class VendorResource extends Resource
{
    protected static ?string $model = Vendor::class;
    protected static ?string $navigationIcon = 'heroicon-o-building-storefront';
    protected static ?string $navigationLabel = 'Vendor Requests';

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('store_name')->required(),
            TextInput::make('address'),
            TextInput::make('phone')->disabled(),
            TextInput::make('email')->disabled(),
            Select::make('status')
                ->options(VendorStatusEnum::labels())
                ->default(VendorStatusEnum::Pending->value)
                ->required(),
            Select::make('availability')
                ->options([
                    'available' => 'Available',
                    'out' => 'Out',
                ])
                ->default('available')
                ->required()
                ->reactive()
                ->afterStateUpdated(fn ($state, $record) => self::updateProductStatus($record, $state)),
            TextArea::make('rejection_reason')
                ->label('Rejection Reason')
                ->visible(fn (Forms\Get $get) => $get('status') === VendorStatusEnum::Rejected->value)
                ->required(fn (Forms\Get $get) => $get('status') === VendorStatusEnum::Rejected->value),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('store_name')->sortable()->searchable(),
            TextColumn::make('address')->sortable()->searchable(),
            TextColumn::make('phone')->sortable(),
            TextColumn::make('email')->sortable(),
            TextColumn::make('status')
                ->badge()
                ->color(fn ($state): string => VendorStatusEnum::colors()[$state->value] ?? 'gray'),
            TextColumn::make('availability')
                ->badge()
                ->color(fn ($state): string => $state === 'out' ? 'danger' : 'success'),
            TextColumn::make('created_at')->dateTime(),
        ])
            ->filters([
                SelectFilter::make('status')->options(VendorStatusEnum::labels()),
                SelectFilter::make('availability')->options([
                    'available' => 'Available',
                    'out' => 'Out',
                ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListVendors::route('/'),
            'edit' => EditVendor::route('/{record}/edit'),
        ];
    }

    public static function canViewAny(): bool
    {
        $user = Filament::auth()->user();
        return $user && $user->hasRole(RolesEnum::Admin);
    }

    /**
     * Updates all related products' status when vendor availability changes.
     */
    private static function updateProductStatus(Vendor $vendor, string $availability): void
    {
        if ($availability === 'out') {
            $vendor->products()->update(['status' => ProductStatusEnum::Draft->value]);
        }
    }
}
