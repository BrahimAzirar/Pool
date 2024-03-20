<?php

namespace App\Http\Controllers;

use App\Models\Traiteur;
use App\Models\traiteur_tool;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            return response()->json(["error" => $e->getMessage()]);
        }
    }


    function GetTraiteurs() : JsonResponse {
        try {
            $traiteurs = Traiteur::select("id", "Name") -> get();
            return response() -> json([ "response" => $traiteurs ]);
        } catch (\Exception $e) {
            return response() -> json(["error" => $e -> getMessage()]);
        }
    }

    function deleteTraiteur(int $id) : JsonResponse {
        try {
            Traiteur::destroy($id);
            return response() -> json([ "response" => true ]);
        } catch (\Exception $e) {
            return response() -> json(["error" => $e -> getMessage()]);
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
            return response() -> json(["error" => $e -> getMessage()]);
        }
    }

    public function _AddTraiteurs(Request $request)
    {
        DB::beginTransaction();

        try {
            $data = [];
            $Req_Data = $request->all();
            $Traiteur = new Traiteur();

            $Traiteur -> Name = $Req_Data['Trai_Name'];

            $Traiteur -> save();

            foreach ($request->all() as $item['data']) {
                $data[] = [
                    'tool_id' => $item['tool_id'],
                    'qty' => $Traiteur -> id,
                    'price' => $item['price'],
                    'qty' => $item['quantity'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            traiteur_tool::insert($data);
            DB::commit();
            return response() -> json(["response" => true]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(["error" => $e->getMessage()]);
        }
    }
}
