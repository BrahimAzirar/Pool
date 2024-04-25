<?php

namespace App\Http\Controllers;

use App\Models\CalculPreson;
use App\Models\Client;
use App\Models\Depenses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CalculPresonController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $credits = Client::leftJoin(DB::raw('(SELECT SelectedClient, SUM(offer * add_person) AS pools_sum
                    FROM pools
                    WHERE PaymentMethod = "Credit"
                    GROUP BY SelectedClient) AS p'), 'clients.id', '=', 'p.SelectedClient')
                ->leftJoin(DB::raw('(SELECT ClientId, SUM(price) AS salles_sum
                                FROM salles
                                WHERE PaymentMethod = "Credit"
                                GROUP BY ClientId) AS s'), 'clients.id', '=', 's.ClientId')
                ->leftJoin(DB::raw('(SELECT ClientId, SUM(Total) AS traiteur_sum
                                FROM traiteur_totals
                                WHERE PaymentMethod = "Credit"
                                GROUP BY ClientId) AS t'), 'clients.id', '=', 't.ClientId')
                ->select('clients.id AS ClientId')
                ->selectRaw('COALESCE(p.pools_sum, 0) + COALESCE(s.salles_sum, 0) + COALESCE(t.traiteur_sum, 0) AS Credit')
                ->get();

            $cash = Client::leftJoin(DB::raw('(SELECT SelectedClient, SUM(offer * add_person) AS pools_sum
                    FROM pools
                    WHERE PaymentMethod = "pay cash"
                    GROUP BY SelectedClient) AS p'), 'clients.id', '=', 'p.SelectedClient')
                ->leftJoin(DB::raw('(SELECT ClientId, SUM(price) AS salles_sum
                                FROM salles
                                WHERE PaymentMethod = "pay cash"
                                GROUP BY ClientId) AS s'), 'clients.id', '=', 's.ClientId')
                ->leftJoin(DB::raw('(SELECT ClientId, SUM(Total) AS traiteur_sum
                                FROM traiteur_totals
                                WHERE PaymentMethod = "pay cash"
                                GROUP BY ClientId) AS t'), 'clients.id', '=', 't.ClientId')
                ->select('clients.id AS ClientId')
                ->selectRaw('COALESCE(p.pools_sum, 0) + COALESCE(s.salles_sum, 0) + COALESCE(t.traiteur_sum, 0) AS Cash')
                ->get();

            $check = Client::leftJoin(DB::raw('(SELECT SelectedClient, SUM(offer * add_person) AS pools_sum
                FROM pools
                WHERE PaymentMethod = "Payment by check"
                GROUP BY SelectedClient) AS p'), 'clients.id', '=', 'p.SelectedClient')
                ->leftJoin(DB::raw('(SELECT ClientId, SUM(price) AS salles_sum
                FROM salles
                WHERE PaymentMethod = "Payment by check"
                GROUP BY ClientId) AS s'), 'clients.id', '=', 's.ClientId')
                ->leftJoin(DB::raw('(SELECT ClientId, SUM(Total) AS traiteur_sum
                FROM traiteur_totals
                WHERE PaymentMethod = "Payment by check"
                GROUP BY ClientId) AS t'), 'clients.id', '=', 't.ClientId')
                ->select('clients.id as ClientId')
                ->selectRaw('COALESCE(p.pools_sum, 0) + COALESCE(s.salles_sum, 0) + COALESCE(t.traiteur_sum, 0) AS PaymentByCheck')
                ->get();

            $depense = Depenses::select('persone_id as ClientId', DB::raw('SUM(price) as spent'))
                ->groupBy('persone_id')
                ->get();

            $clientDetails = CalculPreson::select('persone_id as ClientId', 'credit_for_him', 'khlstou', 'borrow_me')
                ->get();

            return response()->json(["response" => [
                $credits, $cash, $check, $depense, $clientDetails
            ]]);
        } catch (\Exception $e) {
            Log::error("The error in CalculPresonController => index: " . $e->getMessage());
            return response()->json(["err" => "An error in the server try later"]);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $data = CalculPreson::where("persone_id", $id)->firstOrFail();

            $data->borrow_me = $request->input('borrow_me');
            $data->credit_for_him = $request->input('credit_for_him');
            $data->khlstou = $request->input('paidHim');

            $data->save();

            return response()->json(["response" => true]);
        } catch (\Exception $e) {
            Log::error("Error in CalculPresonController => update: " . $e->getMessage());
            return response()->json(["err" => "An error occurred on the server. Please try again later."], 500);
        }
    }
}
