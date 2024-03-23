<?php

namespace App\Http\Controllers;

use App\Models\Traiteur;
use App\Models\traiteur_tools;
use Illuminate\Http\Request;
use \Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class TraiteurController extends Controller
{
    function updateTraiteur(Request $request) : JsonResponse {
        try {
            $id = $request->input('id');
            $name = $request->input('name');

            $Traiteur = Traiteur::find($id);

            $Traiteur->Name = $name;
            $Traiteur->save();

            return response()->json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => updateTraiteur: ". $e -> getMessage());
            return response() -> json(["err" => "An error in the server try later"]);
        }
    }


    function GetTraiteurs() : JsonResponse {
        try {
            $traiteurs = Traiteur::select("id", "Name") -> get();
            return response() -> json([ "response" => $traiteurs ]);
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => GetTraiteurs: ". $e -> getMessage());
            return response() -> json(["err" => "An error in the server try later"]);
        }
    }

    function deleteTraiteur(int $id) : JsonResponse {
        try {
            Traiteur::destroy($id);
            return response() -> json([ "response" => true ]);
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => deleteTraiteur: ". $e -> getMessage());
            return response() -> json(["err" => "An error in the server try later"]);
        }
    }

    public function AddTraiteurs (Request $request): JsonResponse {
        try {
            $TraiteurName = $request -> input('name');
            $Traiteur = new Traiteur();

            $Traiteur -> Name = $TraiteurName;

            $Traiteur -> save();

            return response() -> json([ "response" => $Traiteur -> id ]);
        } catch (\Exception $e) {
            Log::error("The error in TraiteurController => AddTraiteurs: ". $e -> getMessage());
            return response() -> json(["err" => "An error in the server try later"]);
        }
    }

    public function AddTraiteurTool(Request $request)
{
    try {
        $data = [];
        $Traiteurs = $request['Traiteurs'];
        $dateEnd = $request['dateEnd'];
        $dateStart = $request['dateStart'];
        $targetTraitreur = $request['targetTraitreur'];

        foreach ($Traiteurs as $item) {
            $data[] = [
                "tool_id" => $item['tool_id'],
                "traiteur_id" => $targetTraitreur,
                "price" => $item['price'],
                "qty" => $item['quantity'],
                "dateStart" => $dateStart,
                "dateEnd" => $dateEnd,
            ];
        };

        Log::alert($data);

        $insertedIds = traiteur_tools::insertGetId($data);

        return response()->json(["response" => $insertedIds]);
    } catch (\Exception $e) {
        Log::error("The error in TraiteurController => AddTraiteurTool: ". $e->getMessage());
        return response()->json(["err" => "An error occurred on the server. Please try again later."], 500);
    }
}

}
