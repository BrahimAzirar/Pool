<?php

namespace App\Http\Controllers;

use Ramsey\Uuid\Uuid;
use App\Models\Traiteur;
use App\Models\traiteur_tools;
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
            $Traiteurs = $request->input('Traiteurs');
            $dateEnd = $request->input('dateEnd');
            $dateStart = $request->input('dateStart');
            $targetTraitreur = $request->input('targetTraitreur');
            $targetClient = $request->input('targetClient');

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

            return response()->json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => AddTraiteurTool: " . $e->getMessage());
            return response()->json(["err" => "An error occurred on the server. Please try again later."], 500);
        }
    }

    function getAllTraiteursTools(): JsonResponse
    {
        try {
            return response()->json(["response" => traiteur_tools::whereColumn('returnedQty', '<>', 'qty')->get()]);
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => getAllTraiteursTools: " . $e->getMessage());
            return response()->json(["err" => "An error occurred on the server. Please try again later."], 500);
        }
    }

    function getTargetTraiteurs($id) : JsonResponse {
        try {
            $traiteurs = traiteur_tools::select('traiteur_tools.id', 'traiteur_tools.tool_id', 'tools.name as tool_name', 'traiteur_tools.traiteur_id', 'traiteurs.Name as traiteur_name', 'traiteur_tools.qty', 'traiteur_tools.returnedQty', 'traiteur_tools.dateStart', 'traiteur_tools.dateEnd')
                ->join('tools', 'traiteur_tools.tool_id', '=', 'tools.id')
                ->join('traiteurs', 'traiteur_tools.traiteur_id', '=', 'traiteurs.id')
                ->where('traiteur_tools.ClientId', $id)
                ->get();

            return response() -> json(["response" => $traiteurs]);
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => getTargetTraiteurs: " . $e->getMessage());
            return response()->json(["err" => "An error occurred on the server. Please try again later."], 500);
        }
    }

    function deleteTraiteursTool($id): JsonResponse
    {
        try {
            if (is_numeric($id)) {
                traiteur_tools::destroy($id);
                return response()->json(["response" => true]);
            };

            return response()->json(["response" => false]);
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => deleteTraiteursTool: " . $e->getMessage());
            return response()->json(["err" => "An error occurred on the server. Please try again later."], 500);
        }
    }

    function UpdateTraiteurTool(Request $request): JsonResponse
    {
        try {
            $id = $request->input('id');
            $ClientId = $request->input('ClientId');
            $tool_id = $request->input('tool_id');
            $traiteur_id = $request->input('traiteur_id');
            $price = $request->input('price');
            $qty = $request->input('qty');
            $returnedQty = $request -> input('returnedQty');
            $dateStart = $request->input('dateStart');
            $dateEnd = $request->input('dateEnd');

            $target = traiteur_tools::find($id);

            if ($ClientId) $target->ClientId = $ClientId;
            $target->tool_id = $tool_id;
            $target->traiteur_id = $traiteur_id;
            if ($price) $target->price = $price;
            $target->qty = $qty;
            if ($returnedQty) $target -> returnedQty = $returnedQty;
            $target->dateStart = $dateStart;
            $target->dateEnd = $dateEnd;

            $target->save();

            return response()->json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => UpdateTraiteurTool: " . $e->getMessage());
            return response()->json(["err" => "An error occurred on the server. Please try again later."], 500);
        }
    }
}
