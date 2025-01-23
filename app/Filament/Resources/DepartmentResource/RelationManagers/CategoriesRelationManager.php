<?php

namespace App\Filament\Resources\DepartmentResource\RelationManagers;

use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\QueryException;

class CategoriesRelationManager extends RelationManager
{
    protected static string $relationship = 'categories';

    public function form(Form $form): Form
    {
        $department = $this->getOwnerRecord();

        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Select::make('parent_id')
                    ->label('Parent Category')
                    ->options(function () use ($department) {
                        return Category::query()
                            ->where('department_id', $department->id)
                            ->pluck('name', 'id');
                    })
                    ->preload()
                    ->searchable()
                    ->placeholder('No Parent'),
                Forms\Components\Checkbox::make('active')
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('parent.name')
                    ->label('Parent Name')
                    ->sortable()
                    ->searchable()
                    ->default('N/A'),
                Tables\Columns\IconColumn::make('active')
                    ->boolean(),
            ])
            ->filters([])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->action(function ($record) {
                        try {
                            $record->delete(); // Attempt to delete the record
                        } catch (QueryException $e) {
                            if ($e->getCode() === '23000') { // Foreign key constraint violation
                                \Filament\Notifications\Notification::make()
                                    ->title('Error')
                                    ->body('This category cannot be deleted because it is being used as a parent.')
                                    ->danger()
                                    ->send();

                                // Redirect back to the same page
                                return redirect()->back();
                            }

                            throw $e; // Rethrow other exceptions
                        }

                        \Filament\Notifications\Notification::make()
                            ->title('Success')
                            ->body('Category deleted successfully.')
                            ->success()
                            ->send();

                        return redirect()->back(); // Ensure the page reloads
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}

