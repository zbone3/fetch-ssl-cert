import * as https from 'https'
import { RequestOptions } from 'https'
import {
  ExtendedError,
  ExtendedIncomingMessage,
  FetchSslCertOptions,
  SslCertResponse,
  SslErrors,
} from './typings'
import { DetailedPeerCertificate, PeerCertificate } from 'tls'

// Defaults
const PORT = 443
const PROTOCOL = 'https:'
const TIMEOUT = 5000
const DETAILED = false

const ErrorDetectionRules = [
  {
    pattern: /EPROTO/,
    type: SslErrors.SSL_PROTOCOL_ERROR,
  },
  {
    pattern: /timeout/i,
    type: SslErrors.TIMEOUT_ERROR,
  },
  {
    pattern: /ENOTFOUND/i,
    type: SslErrors.HOST_NOT_FOUND_ERROR,
  },
  {
    pattern: /ECONNRESET/i,
    type: SslErrors.CONNECTION_RESET_ERROR,
  },
  {
    pattern: /ECONNREFUSED/i,
    type: SslErrors.CONNECTION_REFUSED_ERROR,
  },
]

const promisifiedHttpsGet = (requestOptions: RequestOptions,
  abortController: AbortController): Promise<ExtendedIncomingMessage> => new Promise(
  (resolve, reject) => {
    const timeout = requestOptions.timeout || TIMEOUT
    try {
      const request = https.get(requestOptions, res => {
        // Need to provide extended interface to support getPeerCertificate (not properly typed)
        resolve(res as ExtendedIncomingMessage)
      })

      request.setTimeout(timeout, () => {
        request.destroy()
        reject('TIMEOUT')
      })

      // use its "timeout" event to abort the request
      request.on('timeout', () => {
        request.destroy()
        reject('TIMEOUT')
      })

      // use its "error" event to abort the request
      request.on('error', e => {
        request.destroy()
        reject(e)
      })

      request.end()
    } catch (e) {
      reject(e)
    }

    abortController.signal.addEventListener('abort', () => {
      reject('ABORT')
    })

  })

const promisifiedTimeout = (timeout: number,
  abortController: AbortController): Promise<SslErrors.TIMEOUT_ERROR> => new Promise(
  (resolve, reject) => {
    const __timeout = setTimeout(() => {
      resolve(SslErrors.TIMEOUT_ERROR)
    }, timeout)

    abortController.signal.addEventListener('abort', () => {
      clearTimeout(__timeout)
      reject('ABORT')
    })
  })

function buildOptions (providedOptions: Partial<FetchSslCertOptions>): FetchSslCertOptions {
  const { timeout, detailed, port, protocol } = providedOptions

  if (timeout === undefined || timeout === null || timeout < 0) {
    providedOptions.timeout = timeout || TIMEOUT
  }

  if (detailed === undefined || detailed === null) {
    providedOptions.detailed = detailed || DETAILED
  }

  providedOptions.protocol = protocol || PROTOCOL
  providedOptions.port = port || PORT

  return providedOptions as FetchSslCertOptions
}

function generateExecutionOptions (hostname: string, port: number,
  protocol: string, timeout: number): RequestOptions {
  return {
    hostname,
    port,
    protocol,
    timeout,
    agent: false,
    rejectUnauthorized: false,
    ciphers: 'ALL',
  }
}

function assessError (e: ExtendedError): SslErrors {
  const { message, code } = e
  for (const errorDetectionRule of ErrorDetectionRules) {
    const { pattern, type } = errorDetectionRule
    if (code && code.match(pattern)) {
      return type
    }
    if (message.match(pattern)) {
      return type
    }
  }
  return SslErrors.UNKNOWN_ERROR
}

function generateError (sslError: SslErrors, executionStart: number,
  executionOptions: FetchSslCertOptions,
  rawError?: ExtendedError): SslCertResponse {
  const executionTime = Date.now() - executionStart
  return {
    success: false,
    error: sslError,
    originalError: rawError || null,
    executionTime,
    executionOptions,
    certificate: null,
  }
}

function generateSuccess (certificate: PeerCertificate | DetailedPeerCertificate,
  executionStart: number,
  executionOptions: FetchSslCertOptions,
): SslCertResponse {
  const executionTime = Date.now() - executionStart
  return {
    success: true,
    error: null,
    originalError: null,
    executionTime,
    executionOptions,
    certificate,
  }
}

export async function fetchSslCert (hostname: string,
  providedOptions: Partial<FetchSslCertOptions> = {}): Promise<SslCertResponse> {
  const abortController = new AbortController()
  const startTime = Date.now()
  let errorType = SslErrors.UNKNOWN_ERROR
  let originalError

  if (!hostname || !hostname.length) {
    throw Error(`Illegal hostname ${hostname} provided`)
  }

  const options = buildOptions(providedOptions)
  const { port, protocol, timeout, detailed } = options

  try {
    const sslOptions = generateExecutionOptions(hostname, port, protocol,
      timeout)

    // Ensure timeout on connection
    const sslResult = await Promise.race(
      [
        promisifiedHttpsGet(sslOptions, abortController),
        promisifiedTimeout(timeout, abortController)])

    // Check if timeout triggered
    if (sslResult === SslErrors.TIMEOUT_ERROR) {
      abortController.abort()
      return generateError(SslErrors.TIMEOUT_ERROR, startTime, options)
    }

    if (sslResult && sslResult.socket) {
      const certificate = sslResult.socket.getPeerCertificate(detailed)
      if (certificate) {
        abortController.abort()
        return generateSuccess(certificate, startTime, options)
      }
    } else {
      errorType = SslErrors.SOCKET_ERROR
    }
  } catch (e: unknown) {
    errorType = assessError(e as ExtendedError)
    originalError = e as ExtendedError
  }

  abortController.abort()
  return generateError(errorType, startTime, options, originalError)
}
