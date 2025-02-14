<?php /** @noinspection PhpMultipleClassDeclarationsInspection */

namespace App\Filament\Resources;

use App\Enum\ProductStatusEnum;
use App\Enum\RolesEnum;
use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\Pages\EditProduct;
use App\Filament\Resources\ProductResource\Pages\ProductImages;
use App\Filament\Resources\ProductResource\Pages\ProductVariationTypes;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Department;
use App\Models\Product;
use Filament\Actions\CreateAction;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Pages\SubNavigationPosition;
use Filament\Resources\Pages\Page;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-c-tag';

    protected static  SubNavigationPosition $subNavigationPosition = SubNavigationPosition::End;
    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where('vendor_id', auth()->id()); // Only show products for logged-in vendor
    }


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Grid::make()
                    ->schema([
                        TextInput::make('title')
                            ->label('Product')
                            ->live(onBlur: true)
                            ->required()
                            ->unique(table: Product::class, column: 'title', ignoreRecord: true)
                            ->afterStateUpdated(function (string $operation, $state, callable $set) {
                                $set('slug', Str::slug($state));
                            }),
                        TextInput::make('slug')
                            ->label('Route')
                            ->required(),

                        Select::make('department_id')
                            ->relationship('department', 'name')
                            ->label(__('Department'))
                            ->preload()
                            ->searchable()
                            ->required()
                            ->reactive()
                            ->afterStateUpdated(function(callable $set) {
                                $set('category_id', null);
                            }),

                        Select::make('category_id')
                            ->relationship(
                                name: 'category',
                                titleAttribute: 'name',
                                modifyQueryUsing: function (Builder $query, callable $get) {
                                    $departmentId = $get('department_id');
                                    if ($departmentId) {
                                        $query->where('department_id', $departmentId);
                                    }
                                }
                            )
                            ->label(__('Category'))
                            ->preload()
                            ->searchable()
                            ->required(),

                        // 🔹 Automatically set vendor_id (Hidden Field)
                        Forms\Components\Hidden::make('vendor_id')
                            ->default(fn() => auth()->user()->vendor ? auth()->user()->id : null)
                            ->required(),
                    ])->columnSpan(2),

                Forms\Components\RichEditor::make('description')
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
                    ->columnSpan(2),

                TextInput::make('price')->required()->numeric(),
                TextInput::make('quantity')->integer(),

                Select::make('status')
                    ->options(ProductStatusEnum::labels())
                    ->default(ProductStatusEnum::Draft->value)
                    ->required()
                    ->disabled(function ($get, $record) {
                        if (!$record) return false; // If creating a new product, allow editing
                        return optional($record->vendor)->availability === 'out';
                    })
            ]);
    }


    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                SpatieMediaLibraryImageColumn::make('images')
                    ->label('image')
                    ->collection('images')
                    ->limit(1)
                    ->conversion('thumb'),// Hide by default on smaller screens
                Tables\Columns\TextColumn::make('title')
                    ->label('Product') // Change the display name to "Product"
                    ->sortable()
                    ->words(10)
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->colors(ProductStatusEnum::colors()),
                Tables\Columns\TextColumn::make('department.name')
                    ->toggleable(isToggledHiddenByDefault: false),
                Tables\Columns\TextColumn::make('category.name')
                    ->toggleable(isToggledHiddenByDefault: false),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->toggleable(isToggledHiddenByDefault: false),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options(ProductStatusEnum::labels()),
                Tables\Filters\SelectFilter::make('department_id')
                    ->relationship('department', 'name')
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }
    public static function canViewAny(): bool
    {
        $user = Filament::auth()->user();
        return $user && $user->hasRole(RolesEnum::Vendor);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
            'images' => Pages\ProductImages::route('/{record}/images'),
            'variation-types' => Pages\ProductVariationTypes::route('/{record}/variation-types'),
            'variation' => Pages\ProductVariations::route('/{record}/variations'),
        ];
    }

    public static function getRecordSubNavigation(Page $page): array
    {
        return $page->generateNavigationItems
            ([
                EditProduct::class,
                ProductImages::class,
                ProductVariationTypes::class,
                Pages\ProductVariations::class,
            ]);

    }
}
