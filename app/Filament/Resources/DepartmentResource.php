<?php

namespace App\Filament\Resources;

use App\Enum\RolesEnum;
use App\Filament\Resources\DepartmentResource\Pages;
use App\Filament\Resources\DepartmentResource\RelationManagers\CategoriesRelationManager;
use App\Models\Department;
use Filament\Facades\Filament;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class DepartmentResource extends Resource
{
    protected static ?string $model = Department::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->live(onBlur: true)
                    ->required()
                    ->rules(['string', 'max:255', 'unique:departments,name'])
                    ->afterStateUpdated(function ($state, callable $set) {
                        if (is_string($state) && !empty($state)) {
                            $slug = Str::slug($state);

                            // Ensure unique slugs
                            $existingSlugCount = Department::where('slug', 'LIKE', "$slug%")->count();
                            if ($existingSlugCount > 0) {
                                $slug .= '-' . ($existingSlugCount + 1);
                            }

                            $set('slug', $slug);
                        }
                    }),
                TextInput::make('slug')
                    ->required()
                    ->rules(['string', 'max:255', 'unique:departments,slug']),
                Checkbox::make('active')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->sortable()
                    ->searchable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getValidationMessages(): array
    {
        return [
            'name.unique' => 'The name has already been taken.',
            'slug.unique' => 'The slug has already been taken.',
        ];
    }

    public static function getRelations(): array
    {
        return [CategoriesRelationManager::class];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDepartments::route('/'),
            'create' => Pages\CreateDepartment::route('/create'),
            'edit' => Pages\EditDepartment::route('/{record}/edit'),
        ];
    }
}
