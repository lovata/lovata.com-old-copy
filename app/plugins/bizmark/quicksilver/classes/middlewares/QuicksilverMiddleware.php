<?php namespace BizMark\Quicksilver\Classes\Middlewares;

use Closure;
use Illuminate\Http\Request;
use BizMark\Quicksilver\Classes\Contracts\Quicksilver;

/**
 * CacheMiddleware middleware
 * @package BizMark\Quicksilver\Classes\Middlewares
 * @author Nick Khaetsky, Biz-Mark
 */
class QuicksilverMiddleware
{

    /**
     * Middleware constructor.
     *
     * @param Quicksilver $cache
     */
    public function __construct(protected Quicksilver $cache)
    {
    }

    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($this->cache->has($request)) {
            return $this->cache->get($request);
        }

        return $next($request);
    }

    public function terminate(Request $request, $response)
    {
        if (!$this->cache->has($request) && $this->cache->validate($request, $response)) {
            $this->cache->store($request, $response);
        }
    }
}
