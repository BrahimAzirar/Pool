<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CafeController;
use App\Http\Controllers\DepensesController;
use App\Http\Controllers\PoolController;
use App\Http\Controllers\SalleController;
use App\Http\Controllers\ToolController;
use App\Http\Controllers\TraiteurController;
use App\Http\Controllers\TraiteurToolController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::apiResource("cafes", CafeController::class);
Route::apiResource("depenses", DepensesController::class);
Route::apiResource("tools", ToolController::class);
Route::apiResource("salles", SalleController::class);
Route::apiResource("pools", PoolController::class);
Route::get("salle", [SalleController::class, "index_salle"]);

Route::post("/AddTraiteurs", [TraiteurController::class, "AddTraiteurs"]);
Route::get("/getAllTraiteurs", [TraiteurController::class, "GetTraiteurs"]);
Route::delete("/deleteTraiteur/{id}", [TraiteurController::class, "deleteTraiteur"]);
Route::post("/updateTraiteur", [TraiteurController::class, "updateTraiteur"]);
Route::post("/AddTraiteurTool", [TraiteurController::class, "AddTraiteurTool"]);
