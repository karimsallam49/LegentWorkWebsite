/**
 * Legend ProteK — Careers email relay.
 *
 * Receives a POST from the website application form and forwards it as a
 * real email (with CV attachment) to the HR address — sent from YOUR Gmail,
 * so it lands in the inbox, not spam.
 *
 * Setup (one time, ~2 minutes):
 *   1. Go to https://script.google.com → New project → paste this file.
 *   2. Deploy → New deployment → type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   3. Copy the /exec URL into .env as VITE_EMAIL_RELAY_URL.
 *   4. (Optional) change HR_EMAIL below or rely on `to` from the site.
 *
 * The site sends application/JSON over a "simple request" (text/plain body)
 * to avoid a CORS preflight; the response is read in no-cors mode anyway.
 */

var HR_EMAIL = 'hr@legendprotek.com' // fallback when `to` isn't provided
var SENDER_NAME = 'Legend ProteK Careers'

function doPost(e) {
  var data = JSON.parse(e.postData.contents)
  var to = data.to || HR_EMAIL

  var fields = [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Experience', data.experience],
    ['Position', data.position],
    ['Message', data.message],
  ]

  var rows = fields
    .filter(function (f) { return f[1] })
    .map(function (f) {
      return (
        '<tr><td style="padding:6px 12px;color:#888;white-space:nowrap">' + f[0] +
        '</td><td style="padding:6px 12px">' + String(f[1]).replace(/\n/g, '<br>') + '</td></tr>'
      )
    })
    .join('')

  var htmlBody =
    '<div style="font-family:Arial,sans-serif;max-width:560px">' +
    '<h2 style="color:#b8942e">New Job Application — Legend ProteK</h2>' +
    '<table style="border-collapse:collapse;border:1px solid #ddd">' + rows + '</table>' +
    '</div>'

  var plainBody = fields
    .filter(function (f) { return f[1] })
    .map(function (f) { return f[0] + ': ' + f[1] })
    .join('\n')

  var options = {
    htmlBody: htmlBody,
    replyTo: data.email || undefined,
    name: SENDER_NAME,
  }

  if (data.file && data.file.base64) {
    options.attachments = [
      Utilities.newBlob(
        Utilities.base64Decode(data.file.base64),
        data.file.mimeType || 'application/octet-stream',
        data.file.name || 'cv',
      ),
    ]
  }

  MailApp.sendEmail(to, data.subject || 'Job Application — Legend ProteK', plainBody, options)

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON)
}

/** Optional: lets you open the URL in a browser to confirm it's deployed. */
function doGet() {
  return ContentService.createTextOutput('Legend ProteK mail relay is running.')
}
