import { IncomingMessage } from "http";
import { DetailedPeerCertificate, PeerCertificate } from "tls";
import { Socket } from "net";

// Generic types
export type Nullable<T> = null | T;

export interface FetchSslCertOptions {
  port: number;
  protocol: string;
  timeout: number;
  detailed: boolean;
}

export interface ExtendedSocket extends Socket {
  getPeerCertificate(
    detailed?: boolean
  ): PeerCertificate | DetailedPeerCertificate;
}

export interface ExtendedIncomingMessage extends IncomingMessage {
  socket: ExtendedSocket;
}

export enum SslErrors {
  SSL_PROTOCOL_ERROR = "SSL_PROTOCOL_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  SOCKET_ERROR = "SOCKET_ERROR",
  HOST_NOT_FOUND_ERROR = "HOST_NOT_FOUND_ERROR",
  CONNECTION_RESET_ERROR = "CONNECTION_RESET_ERROR",
  CONNECTION_REFUSED_ERROR = "CONNECTION_REFUSED_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface SslCertResponse {
  success: boolean;
  error: Nullable<SslErrors>;
  originalError: Nullable<ExtendedError>;
  executionTime: number;
  executionOptions: FetchSslCertOptions;
  certificate: Nullable<PeerCertificate | DetailedPeerCertificate>;
}

export interface ExtendedError extends Error {
  code?: string;
  errno?: string;
  syscall?: number;
  hostname?: string;
}
