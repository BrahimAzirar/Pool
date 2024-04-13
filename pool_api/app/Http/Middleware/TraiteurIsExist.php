<?php

namespace App\Http\Middleware;

use App\Models\traiteur_tools;
use Closure;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class TraiteurIsExist
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            $tools_ids = array_map(function($ele) {
                return $ele['tool_id'];
            }, $request -> Traiteurs);
            $pass = false;
            $inputs = $request->request->all();
            $tariteur_id = $request->targetTraitreur;
            $date_start = $request->dateStart;
            $date_end = $request->dateEnd;
            $clientId = $request->targetClient;
            $data = traiteur_tools::where('traiteur_id', $tariteur_id)->first();
            $results = traiteur_tools::whereIn('tool_id', $tools_ids)
                ->where('traiteur_id', $tariteur_id)
                ->select('tool_id')
                ->exists();

            if ($results) {
                $err = "Certains des outils que vous avez saisis existent déjà";
                return response()->json(['err' => $err]);
            };

            if ($data !== null) {
                $start = new DateTime($date_start);
                $end = new DateTime($date_end);

                if ($start->format('Y-m-d H:i:s') == $data->dateStart && $end->format('Y-m-d H:i:s') == $data->dateEnd) {
                    $pass = true;
                } else {
                    $err = "La date que vous avez saisie n'est pas la même que la date de cet événement";
                    return response()->json(['err' => $err]);
                }

                if ($clientId == $data -> ClientId) {
                    $pass = true;
                } else {
                    Log::alert($clientId);
                    Log::alert($data -> ClientId);
                    $err = "Ce client n'est pas le même client inscrit à cet événement";
                    return response()->json(['err' => $err]);
                }

            } else {
                $inputs['IsExist'] = false;
                $request->replace($inputs);
            };

            if ($pass) {
                $inputs['IsExist'] = true;
                $request->replace($inputs);
            };

            return $next($request);
        } catch (\Exception $e) {
            Log::error("The error from TraiteurIsExist middleware: " . $e->getMessage());
            return response()->json(['err' => 'An error in the server. try later']);
        }
    }

}
