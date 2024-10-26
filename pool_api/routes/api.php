<?php

use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CafeController;
use App\Http\Controllers\CalculPresonController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepensesController;
use App\Http\Controllers\PoolController;
use App\Http\Controllers\SalleController;
use App\Http\Controllers\ToolController;
use App\Http\Controllers\TraiteurController;
use App\Models\admin;

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
Route::apiResource("calcul_presons", CalculPresonController::class);
Route::apiResource("dashboard", DashboardController::class);
Route::apiResource("tools", ToolController::class);
Route::apiResource("salles", SalleController::class);
Route::apiResource("pools", PoolController::class);
Route::apiResource('client', ClientController::class);

Route::post("/grandSalles", [SalleController::class, "GrandSalles"]);
Route::post("/petiteSalles", [SalleController::class, "PetiteSalles"]);

Route::post("/AddTraiteurs", [TraiteurController::class, "AddTraiteurs"]);
Route::get("/getAllTraiteurs", [TraiteurController::class, "GetTraiteurs"]);
Route::delete("/deleteTraiteur/{id}", [TraiteurController::class, "deleteTraiteur"]);
Route::post("/updateTraiteur", [TraiteurController::class, "updateTraiteur"]);
Route::post("/AddTraiteurTool", [TraiteurController::class, "AddTraiteurTool"]) -> middleware('traiteurIsExist');
Route::post("/getAllTraiteursTools", [TraiteurController::class, "getAllTraiteursTools"]);
Route::get("/getTargetTraiteurs/{id}", [TraiteurController::class, "getTargetTraiteurs"]);
Route::delete("/deleteTraiteursTool/{id}", [TraiteurController::class, "deleteTraiteursTool"]);
Route::post('/UpdateTraiteurTool', [TraiteurController::class, "UpdateTraiteurTool"]);
Route::get("/getToolsData/{id}", [TraiteurController::class, "getToolsData"]);
Route::delete("/deleteTargetTraiteurTool/{id}/{price}/{traiId}", [TraiteurController::class, "deleteTargetTraiteurTool"]);
Route::post('/UpdateTraiteurData', [TraiteurController::class, "UpdateTraiteurData"]);

Route::post("/adminIsExist", [AdminController::class, 'AdminIsExist']) -> middleware('api-session');
Route::get("/adminIsAuth", [AdminController::class, 'AdminIsAuth']) -> middleware('api-session');
Route::get("/logout", [AdminController::class, 'Logout']) -> middleware('api-session');
