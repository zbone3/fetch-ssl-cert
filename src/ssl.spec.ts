import { fetchSslCert } from './ssl'
import { SslErrors } from './typings'

const ErrorTests: [string, SslErrors, number /*timeout*/][] = [
  ['nonexistent-domain.com', SslErrors.CONNECTION_RESET_ERROR, 2000],
  ['sdfsdfdsfsdfdsfsdfdsf.biz', SslErrors.HOST_NOT_FOUND_ERROR, 2000],
  ['dtavdcjysf.duckdns.org', SslErrors.CONNECTION_REFUSED_ERROR, 3000],
  ['majendiestrategynotes.ca', SslErrors.SSL_PROTOCOL_ERROR, 3000],
]

describe('Test SSL Cert Fetch - for existing certificates', () => {
  it('Fetches google.com certificate', async () => {
    const resp = await fetchSslCert('google.com', { timeout: 2500 })
    const { success, certificate } = resp
    expect(success).toBeTruthy()
    expect(certificate?.subject.CN).toEqual('*.google.com')
  }, 5500)

  it('Fetches by IP 140.82.121.3 [Github] certificate', async () => {
    const resp = await fetchSslCert('140.82.121.3', { timeout: 2500 })
    const { success, certificate } = resp
    expect(success).toBeTruthy()
    expect(certificate?.subject.CN).toEqual('github.com')
  }, 5500)
})

describe('Test SSL Cert Fetch - for failing certificates', () => {
  test.each(ErrorTests)('%s should throw error %s in less than %d',
    async (hostname, sslError, timeout) => {
      const resp = await fetchSslCert(hostname, { timeout })
      const { success, error } = resp
      expect(success).toBeFalsy()
      expect(error).toEqual(sslError)
    })

})


