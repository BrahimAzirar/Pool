<?php

namespace App\Http\Controllers;

use App\Models\Salle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class SalleController extends Controller
{
    function GrandSalles(Request $request) : JsonResponse {
        try {
            $now = $request -> now;
            $start = $request -> start;
            $end = $request -> end;

            if ($now) {
                $salles = Salle::where('is_salle', 0)
                    ->where(function ($query) use ($now) {
                        $query->whereDate('date_start', '=', $now)
                              ->orWhereDate('date_end', '=', $now);
                    })
                    ->get();

                return response()->json(['response' => $salles]);
            }
            elseif ($start && $end) {
                $salles = Salle::where('is_salle', 0)
                    ->where(function ($query) use ($start, $end) {
                        $query->whereDate('date_start', '=', $start)
                              ->WhereDate('date_end', '=', $end);
                    })
                    ->get();

                return response()->json(['response' => $salles]);
            }
            elseif ($start) {
                $salles = Salle::where('is_salle', 0)
                    ->where(function ($query) use ($start) {
                        $query->whereDate('date_start', '=', $start);
                    })
                    ->get();

                return response()->json(['response' => $salles]);
            }
            else {
                $salles = Salle::where('is_salle', 0)
                    ->where(function ($query) use ($end) {
                        $query->whereDate('date_end', '=', $end);
                    })
                    ->get();

                return response()->json(['response' => $salles]);
            };
        } catch (\Exception $e) {
            Log::error("The error from SalleController in GrandSalles(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    function PetiteSalles(Request $request) : JsonResponse {
        try {
            $now = $request -> now;
            $start = $request -> start;
            $end = $request -> end;

            if ($now) {
                $salles = Salle::where('is_salle', 1)
                    ->where(function ($query) use ($now) {
                        $query->whereDate('date_start', '=', $now)
                              ->orWhereDate('date_end', '=', $now);
                    })
                    ->get();

                return response()->json(['response' => $salles]);
            }
            elseif ($start && $end) {
                $salles = Salle::where('is_salle', 1)
                    ->where(function ($query) use ($start, $end) {
                        $query->whereDate('date_start', '=', $start)
                              ->WhereDate('date_end', '=', $end);
                    })
                    ->get();

                return response()->json(['response' => $salles]);
            }
            elseif ($start) {
                $salles = Salle::where('is_salle', 1)
                    ->where(function ($query) use ($start) {
                        $query->whereDate('date_start', '=', $start);
                    })
                    ->get();

                return response()->json(['response' => $salles]);
            }
            else {
                $salles = Salle::where('is_salle', 1)
                    ->where(function ($query) use ($end) {
                        $query->whereDate('date_end', '=', $end);
                    })
                    ->get();

                return response()->json(['response' => $salles]);
            };
        } catch (\Exception $e) {
            Log::error("The error from SalleController in GrandSalles(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $salle = new Salle();

            $salle -> ClientId = $request -> ClientId;
            $salle -> is_salle = $request -> is_salle;
            $salle -> date_start = $request -> date_start;
            $salle -> date_end = $request -> date_end;
            $salle -> price = $request -> price;
            $salle -> PaymentMethod = $request -> PaymentMethod;

            $salle -> save();

            return response() -> json(["response" => $salle -> id]);
        } catch (\Exception $e) {
            Log::error("The error from SalleController in store(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    public function update(Request $request, Salle $salle) : JsonResponse
    {
        try {
            $salle -> ClientId = $request -> ClientId;
            $salle -> price = $request -> price;
            $salle -> date_start = $request-> date_start;
            $salle -> date_end = $request-> date_end;
            $salle -> PaymentMethod = $request-> PaymentMethod;
            $salle -> save();
            return response() -> json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error from SalleController in update(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }

    public function destroy(Salle $salle): JsonResponse
    {
        try {
            $salle -> delete();
            return response() -> json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error from SalleController in destroy(): " . $e -> getMessage());
            return response() -> json(["err" => "An error in the server. try later"]);
        }
    }
}
