import MySQL from '../index.js';

describe('aiven cloud', function () {
	this.timeout(0);
	const password = process.env.AIVEN_PASSWORD;
	it('connect by string', async () => {
		const connectionString = `mysql://avnadmin:${password}@mysql-davidkhala.d.aivencloud.com:22013/defaultdb?ssl-mode=REQUIRED`;

		const mysql = new MySQL({}, connectionString);
		await mysql.connect();
		await mysql.disconnect();

	});
	it('connect by options', async () => {
		const username = 'avnadmin';
		const domain = 'mysql-davidkhala.d.aivencloud.com';
		const port = 22013;
		const name = 'defaultdb';

		const mysql = new MySQL({domain, username, password, name, port});
		const ca = `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUB+ro78y0biZA9sFLBHOnX+GKD3wwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvOTU0MDYwMzItMjVlZi00Y2IxLWE0OWYtNzVjNDViNDFk
NDJlIFByb2plY3QgQ0EwHhcNMjQwNDIxMTMyMjU4WhcNMzQwNDE5MTMyMjU4WjA6
MTgwNgYDVQQDDC85NTQwNjAzMi0yNWVmLTRjYjEtYTQ5Zi03NWM0NWI0MWQ0MmUg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBANK0Hhwd
c9sXRBPEMGGyDEpYj7cVHyrw+GYBVaIj4kioA7WtwhRu6pISXEarXqo146sJe6p5
gdXsY5/CzHXtv8Whhjv3CE7eGnwffQDmolWA9dtvYGlTBXUPqPB5yxS2v7seQviV
7T1x/X9f46EXt3G6tFHsyI5Vj3pcNV6G6PxHkGDjnynlPLZ8voKOSxNNWOPNDyRi
+h2uA5cXKFrcvmOLeI0ZKm2DE7PhqKCuInHQEv0/ROZnTTRRsxdyDpoqOyUwWGb/
XrTbEMUaQHTnJD4fE8s9WE/wi3+xOGBhd+vicAYGe00ctyoNS5R83xCrzzhdlyYD
CViqVFu0O/AZFXDfZegGk+lGllWUKv+1O/nal9/zCjilyUn+dfitufdpzDvaGYaY
ALpY4Ig9wLIvUG4j9/EVUWpsSsbdUXWB3HCs+KrpmQhadcPF/9ApRTlW7g5GcvdH
eVAL3PTXR8TBTeNkQF9WFRPR2dVjX+vBUlcIspQrLImK3HWQYrptaprErwIDAQAB
oz8wPTAdBgNVHQ4EFgQUbBKGqUtBdz/hsaHGd5XKrFamR8kwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAMllYmeA5dOo+/ZH
dKxSIUEmPP2OeGCuznwFkiBRh5AwuU6r8qwRwZuxpWDsds4jq4vHmyMiiGrSjSsQ
Kxf78g717QggrD0XrRG5fnI9svekWg5nG28cAzBnqU6MrDr9PtBQ8FkJkfLT/8k5
bvFfqG2m0VxLg1fUmfeYUk6hkkxTWhqCxMcf9esJxw4kH6h/Kl31F+GKU54C4Zrb
IdnLAHoRbP6gMbCDglsrikJCwvFWRH6d3NOaHf8PsEDw1XQZffwhI6Hu2KioMdz7
AtjIvNEkSUShxADhtbTFQDkMDaT5YOtlUvZsdH5tJAJ51P5FpH9UFTX1cAuczpsN
ifi4SUUe1OLzZO/Nok6/OZXTVEkiz1sG7WLyS1N9q/hYl2UdOHFsbfhZ7DVkNo+p
p2TRX4F7dC13aQ4yZ+eH4g5zT5EJHvsJtmUYzz5TzP8iL9lu2XlgVya/ui+sRV22
gIUPmXqRPeV3O3muDxkipp+3yevzmd5gLkUXLwFArW9iTgPd7A==
-----END CERTIFICATE-----
`;

		mysql.ssl = {
			ca,
		};

		await mysql.connect();
		await mysql.disconnect();

	});
});