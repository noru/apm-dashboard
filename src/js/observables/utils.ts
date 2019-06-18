import { Subject } from './rxjs'

interface Request {
  key: number,
  config: any,
}

export const OutgoingRequest$ = new Subject<Request>()
export const CompleteRequest$ = new Subject<Request>()

export const OngoingRequests$ = OutgoingRequest$.merge(CompleteRequest$)
  .scan((map, request) => {
    if (map.has(request.key)) {
      map.delete(request.key)
    } else {
      map.set(request.key, request)
    }
    return map
  }, new Map<number, Request>())
