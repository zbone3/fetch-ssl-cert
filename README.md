# fetch-ssl-cert

A simple Typescript SSL certificate fetcher with promise support.

## Usage

Install from npm

```
npm install fetch-ssl-cert
```

Example usage

``` javascript
import { fetchSslCert } from 'fetch-ssl-cert'

async function fetchSslCertSubject (hostname) {
  const res = await fetchSslCert(hostname)
  const { success, certificate, error } = res
  if (success) {
    console.log(certificate.subject)
  } else {
    throw new Error(`SSL Fetch error: ${error}`)
  }
}

fetchSslCertSubject('google.com')
// { CN: '*.google.com' }
```

## Response

This package returns a standard response `SslCertResponse` to provide a normazlied interface for success and failures (
which can frequently occur across different servers, configurations and hostnames) due to several reasons.

### Successful response

The following response can be expected on success:

```
{
  "success": true,
  "error": null,
  "originalError": null,
  "executionTime": 509,
  "executionOptions": {
    "timeout": 2500,
    "detailed": false,
    "protocol": "https:",
    "port": 443
  },
  "certificate": {
    "subject": {
      "CN": "*.google.com"
    },
    "issuer": {
      "C": "US",
      "O": "Google Trust Services LLC",
      "CN": "GTS CA 1C3"
    },
    "subjectaltname": "DNS:*.google.com, DNS:*.appengine.google.com, DNS:*.bdn.dev, DNS:*.cloud.google.com, DNS:*.crowdsource.google.com, DNS:*.datacompute.google.com, DNS:*.google.ca, DNS:*.google.cl, DNS:*.google.co.in, DNS:*.google.co.jp, DNS:*.google.co.uk, DNS:*.google.com.ar, DNS:*.google.com.au, DNS:*.google.com.br, DNS:*.google.com.co, DNS:*.google.com.mx, DNS:*.google.com.tr, DNS:*.google.com.vn, DNS:*.google.de, DNS:*.google.es, DNS:*.google.fr, DNS:*.google.hu, DNS:*.google.it, DNS:*.google.nl, DNS:*.google.pl, DNS:*.google.pt, DNS:*.googleadapis.com, DNS:*.googleapis.cn, DNS:*.googlevideo.com, DNS:*.gstatic.cn, DNS:*.gstatic-cn.com, DNS:googlecnapps.cn, DNS:*.googlecnapps.cn, DNS:googleapps-cn.com, DNS:*.googleapps-cn.com, DNS:gkecnapps.cn, DNS:*.gkecnapps.cn, DNS:googledownloads.cn, DNS:*.googledownloads.cn, DNS:recaptcha.net.cn, DNS:*.recaptcha.net.cn, DNS:recaptcha-cn.net, DNS:*.recaptcha-cn.net, DNS:widevine.cn, DNS:*.widevine.cn, DNS:ampproject.org.cn, DNS:*.ampproject.org.cn, DNS:ampproject.net.cn, DNS:*.ampproject.net.cn, DNS:google-analytics-cn.com, DNS:*.google-analytics-cn.com, DNS:googleadservices-cn.com, DNS:*.googleadservices-cn.com, DNS:googlevads-cn.com, DNS:*.googlevads-cn.com, DNS:googleapis-cn.com, DNS:*.googleapis-cn.com, DNS:googleoptimize-cn.com, DNS:*.googleoptimize-cn.com, DNS:doubleclick-cn.net, DNS:*.doubleclick-cn.net, DNS:*.fls.doubleclick-cn.net, DNS:*.g.doubleclick-cn.net, DNS:doubleclick.cn, DNS:*.doubleclick.cn, DNS:*.fls.doubleclick.cn, DNS:*.g.doubleclick.cn, DNS:dartsearch-cn.net, DNS:*.dartsearch-cn.net, DNS:googletraveladservices-cn.com, DNS:*.googletraveladservices-cn.com, DNS:googletagservices-cn.com, DNS:*.googletagservices-cn.com, DNS:googletagmanager-cn.com, DNS:*.googletagmanager-cn.com, DNS:googlesyndication-cn.com, DNS:*.googlesyndication-cn.com, DNS:*.safeframe.googlesyndication-cn.com, DNS:app-measurement-cn.com, DNS:*.app-measurement-cn.com, DNS:gvt1-cn.com, DNS:*.gvt1-cn.com, DNS:gvt2-cn.com, DNS:*.gvt2-cn.com, DNS:2mdn-cn.net, DNS:*.2mdn-cn.net, DNS:googleflights-cn.net, DNS:*.googleflights-cn.net, DNS:admob-cn.com, DNS:*.admob-cn.com, DNS:*.gstatic.com, DNS:*.metric.gstatic.com, DNS:*.gvt1.com, DNS:*.gcpcdn.gvt1.com, DNS:*.gvt2.com, DNS:*.gcp.gvt2.com, DNS:*.url.google.com, DNS:*.youtube-nocookie.com, DNS:*.ytimg.com, DNS:android.com, DNS:*.android.com, DNS:*.flash.android.com, DNS:g.cn, DNS:*.g.cn, DNS:g.co, DNS:*.g.co, DNS:goo.gl, DNS:www.goo.gl, DNS:google-analytics.com, DNS:*.google-analytics.com, DNS:google.com, DNS:googlecommerce.com, DNS:*.googlecommerce.com, DNS:ggpht.cn, DNS:*.ggpht.cn, DNS:urchin.com, DNS:*.urchin.com, DNS:youtu.be, DNS:youtube.com, DNS:*.youtube.com, DNS:youtubeeducation.com, DNS:*.youtubeeducation.com, DNS:youtubekids.com, DNS:*.youtubekids.com, DNS:yt.be, DNS:*.yt.be, DNS:android.clients.google.com, DNS:developer.android.google.cn, DNS:developers.android.google.cn, DNS:source.android.google.cn",
    "infoAccess": {
      "OCSP - URI": [
        "http://ocsp.pki.goog/gts1c3"
      ],
      "CA Issuers - URI": [
        "http://pki.goog/repo/certs/gts1c3.der"
      ]
    },
    "bits": 256,
    "pubkey": {
      "type": "Buffer",
      "data": [
        4,
        209,
        168,
        ...
      ]
    },
    "asn1Curve": "prime256v1",
    "nistCurve": "P-256",
    "valid_from": "Aug  1 08:18:00 2022 GMT",
    "valid_to": "Oct 24 08:17:59 2022 GMT",
    "fingerprint": "41:1F:D5:0C:B3:C0:87:BE:97:D4:1F:F1:5D:E2:34:4B:19:9A:E3:DE",
    "fingerprint256": "4B:44:A0:A8:02:B8:D5:CC:5F:2E:43:5B:D1:DD:10:F0:0C:81:71:88:C1:51:E5:AF:3F:2D:16:6B:14:CF:A5:FB",
    "fingerprint512": "8D:79:91:93:DF:6F:36:FA:09:DE:3B:C1:5F:59:1D:89:B6:51:42:42:96:BF:DA:CC:AF:74:F7:06:4B:A7:F5:C5:A2:CF:54:01:C1:A5:BE:10:1E:DD:59:E5:DB:9B:DE:45:A1:E4:F9:0B:44:68:CC:FD:55:B1:42:73:CF:52:08:87",
    "ext_key_usage": [
      "1.3.6.1.5.5.7.3.1"
    ],
    "serialNumber": "AB2CC9E99D3014AB1278C13F18B449BF",
    "raw": {
      "type": "Buffer",
      "data": [
        48,
        130,
        13,
        ...
      ]
    }
  }
}
```

### Error response

An error response can look something like this (e.g. ENOTFOUND):

```
{
  "success": false,
  "error": "HOST_NOT_FOUND_ERROR",
  "originalError": {
    "errno": -3008,
    "code": "ENOTFOUND",
    "syscall": "getaddrinfo",
    "hostname": "sdfsdfdsfsdfdsfsdfdsf.biz"
  },
  "executionTime": 62,
  "executionOptions": {
    "timeout": 2000,
    "detailed": false,
    "protocol": "https:",
    "port": 443
  },
  "certificate": null
}
```

## Error support

Looking up SSL certificates can naturally generate several errors. This can be due to timeouts, incorrect configuration
on the target server, non-existing hostname etc.
As such this project already detects the most common errors and returns a standard response.


| **Error code**             | **Description**                                                                                                                                                                          |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `SSL_PROTOCOL_ERROR`       | Corresponding to EPROTO errors. Can occur for several reasons including: (1) There is an error with the certificate (e.g. expired or invalid) (2) SSL configuration issue on the server. |
| `TIMEOUT_ERROR`            | The request to fetch the SSL certificate timed out (either on the socket level or on the entire e2e flow).                                                                               |
| `SOCKET_ERROR`             | The socket connection has failed (this was not previously observed).                                                                                                                     |
| `HOST_NOT_FOUND_ERROR`     | DNS error - the provided hostname could not be resolved.                                                                                                                                 |
| `CONNECTION_RESET_ERROR`   | The connection was reset or closed by the server, equivalent to ECONNRESET code.                                                                                                         |
| `CONNECTION_REFUSED_ERROR` | The connection was refused by the server, equivalent to ECONNREFUSED code.                                                                                                               |
| `UNKNOWN_ERROR`            | Any other error that was not previously observed - in this case please refer to the `originalError` property in the response to get the raw error object.                                |
