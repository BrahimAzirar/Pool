<?php

namespace App\Http\Controllers;

use App\Models\Tool;
use App\Models\Traiteur;
use App\Models\traiteur_tools;
use App\Models\traiteur_total;
use Illuminate\Http\Request;
use \Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TraiteurController extends Controller
{
    function updateTraiteur(Request $request): JsonResponse
    {
        try {
            $id = $request->input('id');
            $name = $request->input('name');

            $Traiteur = Traiteur::find($id);

            $Traiteur->Name = $name;
            $Traiteur->save();

            return response()->json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => updateTraiteur: " . $e->getMessage());
            return response()->json(["err" => "An error in the server try later"]);
        }
    }


    function GetTraiteurs(): JsonResponse
    {
        try {
            $traiteurs = Traiteur::select("id", "Name")->get();
            return response()->json(["response" => $traiteurs]);
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => GetTraiteurs: " . $e->getMessage());
            return response()->json(["err" => "An error in the server try later"]);
        }
    }

    function deleteTraiteur(int $id): JsonResponse
    {
        try {
            Traiteur::destroy($id);
            return response()->json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => deleteTraiteur: " . $e->getMessage());
            return response()->json(["err" => "An error in the server try later"]);
        }
    }

    public function AddTraiteurs(Request $request): JsonResponse
    {
        try {
            $TraiteurName = $request->input('name');
            $Traiteur = new Traiteur();

            $Traiteur->Name = $TraiteurName;

            $Traiteur->save();

            return response()->json(["response" => $Traiteur->id]);
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => AddTraiteurs: " . $e->getMessage());
            return response()->json(["err" => "An error in the server try later"]);
        }
    }

    public function AddTraiteurTool(Request $request): JsonResponse
    {
        try {
            $data = [];
            $exist = $request->input('IsExist');
            $Traiteurs = $request->input('Traiteurs');
            $dateEnd = $request->input('dateEnd');
            $dateStart = $request->input('dateStart');
            $targetTraitreur = $request->input('targetTraitreur');
            $targetClient = $request->input('targetClient');
            $total = $request -> input("Totatl");
            $PaymentMethod = $request -> input("PaymentMethod");
            $advance = ($request -> input("advance") ? $request -> input("advance") : 0);

            foreach ($Traiteurs as $item) {
                $data[] = [
                    "ClientId" => $targetClient,
                    "tool_id" => $item['tool_id'],
                    "traiteur_id" => $targetTraitreur,
                    "price" => $item['price'],
                    "qty" => $item['quantity'],
                    "returnedQty" => 0,
                    "dateStart" => $dateStart,
                    "dateEnd" => $dateEnd,
                ];
            };

            traiteur_tools::insert($data);

            if ($exist) {
                $old = traiteur_total::where('traiteur_id', $targetTraitreur)->first();
                $old -> Advance += $advance;
                $old -> Total += $total;
                $old -> save();
            } else {
                $traiteur_total = new traiteur_total();

                $traiteur_total -> traiteur_id = $targetTraitreur;
                $traiteur_total -> ClientId = $targetClient;
                $traiteur_total -> Advance = $advance;
                $traiteur_total -> Total = $total;
                $traiteur_total -> PaymentMethod = $PaymentMethod;

                $traiteur_total -> save();
            };

            return response()->json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => AddTraiteurTool: " . $e->getMessage());
            return response()->json(["err" => "An error occurred on the server. Please try again later."], 500);
        }
    }

    function getAllTraiteursTools(Request $request): JsonResponse
    {
        try {
            $now = $request -> now;
            $start = $request -> start;
            $end = $request -> end;

            if ($now) {
                $result = Traiteur::select('traiteur_tools.traiteur_id', 'traiteur_tools.dateStart', 'traiteur_tools.dateEnd', 'traiteur_tools.ClientId', 'traiteur_totals.Total', 'traiteur_totals.Advance', 'traiteur_totals.PaymentMethod')
                    ->join('traiteur_tools', 'traiteurs.id', '=', 'traiteur_tools.traiteur_id')
                    ->join('traiteur_totals', 'traiteurs.id', '=', 'traiteur_totals.traiteur_id')
                    ->join('clients', 'traiteur_tools.ClientId', '=', 'clients.id')
                    ->where(function ($query) use ($now) {
                        $query->whereDate('traiteur_tools.dateStart', '=', $now)
                            ->orWhereDate('traiteur_tools.dateEnd', '=', $now);
                    })
                    ->distinct()
                    ->get();

                return response() -> json(["response" => $result]);
            }
            elseif ($start && $end) {
                $result = Traiteur::select('traiteur_tools.traiteur_id', 'traiteur_tools.dateStart', 'traiteur_tools.dateEnd', 'traiteur_tools.ClientId', 'traiteur_totals.Total', 'traiteur_totals.Advance', 'traiteur_totals.PaymentMethod')
                    ->join('traiteur_tools', 'traiteurs.id', '=', 'traiteur_tools.traiteur_id')
                    ->join('traiteur_totals', 'traiteurs.id', '=', 'traiteur_totals.traiteur_id')
                    ->join('clients', 'traiteur_tools.ClientId', '=', 'clients.id')
                    ->where(function ($query) use ($start, $end) {
                        $query->whereDate('traiteur_tools.dateStart', '=', $start)
                            ->WhereDate('traiteur_tools.dateEnd', '=', $end);
                    })
                    ->distinct()
                    ->get();

                return response() -> json(["response" => $result]);
            }
            elseif ($start) {
                $result = Traiteur::select('traiteur_tools.traiteur_id', 'traiteur_tools.dateStart', 'traiteur_tools.dateEnd', 'traiteur_tools.ClientId', 'traiteur_totals.Total', 'traiteur_totals.Advance', 'traiteur_totals.PaymentMethod')
                    ->join('traiteur_tools', 'traiteurs.id', '=', 'traiteur_tools.traiteur_id')
                    ->join('traiteur_totals', 'traiteurs.id', '=', 'traiteur_totals.traiteur_id')
                    ->join('clients', 'traiteur_tools.ClientId', '=', 'clients.id')
                    ->where(function ($query) use ($start) {
                        $query->whereDate('traiteur_tools.dateStart', '=', $start);
                    })
                    ->distinct()
                    ->get();

                return response() -> json(["response" => $result]);
            }
            else {
                $result = Traiteur::select('traiteur_tools.traiteur_id', 'traiteur_tools.dateStart', 'traiteur_tools.dateEnd', 'traiteur_tools.ClientId', 'traiteur_totals.Total', 'traiteur_totals.Advance', 'traiteur_totals.PaymentMethod')
                    ->join('traiteur_tools', 'traiteurs.id', '=', 'traiteur_tools.traiteur_id')
                    ->join('traiteur_totals', 'traiteurs.id', '=', 'traiteur_totals.traiteur_id')
                    ->join('clients', 'traiteur_tools.ClientId', '=', 'clients.id')
                    ->where(function ($query) use ($end) {
                        $query->whereDate('traiteur_tools.dateEnd', '=', $end);
                    })
                    ->distinct()
                    ->get();

                return response() -> json(["response" => $result]);
            }
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => getAllTraiteursTools: " . $e->getMessage());
            return response()->json(["err" => "An error occurred on the server. Please try again later."], 500);
        }
    }

    function getTargetTraiteurs($id) : JsonResponse {
        try {
            $traiteurs = traiteur_tools::select('traiteur_tools.id', 'traiteur_tools.tool_id', 'clients.FirstName', 'clients.LastName', 'traiteur_tools.price', 'tools.name as tool_name', 'traiteur_tools.qty', 'traiteur_tools.returnedQty', 'traiteur_tools.dateStart', 'traiteur_tools.dateEnd')
                ->join('tools', 'traiteur_tools.tool_id', '=', 'tools.id')
                ->join('clients', 'traiteur_tools.ClientId', '=', 'clients.id')
                ->where('traiteur_tools.traiteur_id', $id)
                ->get();

            return response() -> json(["response" => $traiteurs]);
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => getTargetTraiteurs: " . $e->getMessage());
            return response()->json(["err" => "An error occurred on the server. Please try again later."], 500);
        }
    }

    function deleteTraiteursTool($id): JsonResponse
    {
        DB::beginTransaction();

        try {
            if (is_numeric($id)) {
                traiteur_tools::where('traiteur_id', $id)->delete();
                traiteur_total::where('traiteur_id', $id)->delete();
                DB::commit();
                return response()->json(["response" => true]);
            };

            return response()->json(["response" => false]);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error("The error in TraiteurController => deleteTraiteursTool: " . $e->getMessage());
            return response()->json(["err" => "An error occurred on the server. Please try again later."], 500);
        }
    }

    function UpdateTraiteurTool(Request $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            $id = $request->input('id');
            $price = $request->input('price');
            $qty = $request->input('qty');
            $returnedQty = $request -> input('returnedQty');
            $traiteur_id = $request -> input("traiteur_id");

            $target = traiteur_tools::find($id);
            $traiteurTotal = traiteur_total::where("traiteur_id", $traiteur_id) -> first();

            $new_total = $price * $qty;
            $old_tatal = $target->price * $target->qty;

            $target->price = $price;
            $target->qty = $qty;
            $target -> returnedQty = $returnedQty;

            $traiteurTotal -> Total = abs(($traiteurTotal -> Total - $old_tatal) + $new_total);

            $target->save();
            $traiteurTotal -> save();

            DB::commit();
            return response()->json(["response" => true]);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error("The error in TraiteurController => UpdateTraiteurTool: " . $e->getMessage());
            return response()->json(["err" => "An error occurred on the server. Please try again later."], 500);
        }
    }

    function getToolsData($id) : JsonResponse {
        try {
            $tools = traiteur_tools::select("traiteur_id", "tool_id", "price", "qty", "returnedQty")
                -> where("traiteur_id", "=", $id)
                -> get();

            return response() -> json(["response" => $tools]);
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => getToolsData: " . $e->getMessage());
            return response()->json(["err" => "An error occurred on the server. Please try again later."], 500);
        }
    }

    public function deleteTargetTraiteurTool($id, $price, $traiId): JsonResponse {
        DB::beginTransaction();

        try {
            traiteur_tools::destroy($id);

            $target = traiteur_total::where('traiteur_id', $traiId)->first();

            if ($target -> Total - $price <= 0) {
                $result = $target -> Total - $price;
                $target -> Total = 0;
                $target -> Advance += $result;

                if ($target -> Advance <= 0) {
                    traiteur_total::where('traiteur_id', $traiId) -> delete();
                };
            } else {
                $target->Total = $target->Total - $price;
            };

            $target->save();

            DB::commit();

            return response()->json(["response" => true]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error in TraiteurController => deleteTargetTraiteurTool: " . $e->getMessage());
            return response()->json(["err" => "An error occurred on the server. Please try again later."], 500);
        }
    }

    function UpdateTraiteurData(Request $request): JsonResponse {
    DB::beginTransaction();

    try {
        $id = $request->input("id");
        $ClientId = $request->input("ClientId");
        $Advance = $request->input("Advance");
        $dateStart = $request->input("dateStart");
        $dateEnd = $request->input("dateEnd");
        $PaymentMethod = $request->input("PaymentMethod");

        traiteur_tools::where('traiteur_id', $id)->update([
            'ClientId' => $ClientId,
            'dateStart' => $dateStart,
            'dateEnd' => $dateEnd
        ]);

        $total = traiteur_total::where('traiteur_id', $id)->first();

        $total->Total = $total->Total + $total->Advance - $Advance;
        $total->Advance = $Advance;
        $total->PaymentMethod = $PaymentMethod;
        $total->save();

        DB::commit();

        return response()->json(["response" => true]);
    } catch (\Exception $e) {
        DB::rollBack();
        Log::error("Error in TraiteurController => UpdateTraiteurData: " . $e->getMessage());
        return response()->json(["err" => "An error occurred on the server. Please try again later."], 500);
    }
}
}
