"""Render a bounded, local saved-observation draft. JSON stdin -> PDF stdout.

No external requests. All vendor strings are escaped, including markup and URLs.
The full source is never copied into a static public asset.
"""
import io
import json
import sys
from datetime import datetime
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, Flowable

ROOT = Path(__file__).resolve().parent
for name, filename in [('Display', 'Spectral-Regular.ttf'), ('DisplayBold', 'Spectral-SemiBold.ttf'), ('Body', 'IBMPlexSans-Regular.ttf'), ('Bold', 'IBMPlexSans-SemiBold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(ROOT / 'pdf-assets' / filename)))
pdfmetrics.registerFontFamily('Body', normal='Body', bold='Bold', italic='Body', boldItalic='Bold')

INK = colors.HexColor('#1d1f23')
BODY = colors.HexColor('#43464b')
MUTED = colors.HexColor('#63666b')
LINE = colors.HexColor('#e7e8ea')
ACCENT = colors.HexColor('#932c21')
SOFT = colors.HexColor('#f7f7f8')
WIDTH = 520
STYLES = {
    'body': ParagraphStyle('body', fontName='Body', fontSize=10.5, leading=15, textColor=BODY, spaceAfter=9, splitLongWords=True),
    'small': ParagraphStyle('small', fontName='Body', fontSize=8.5, leading=12, textColor=MUTED, spaceAfter=7, splitLongWords=True),
    'title': ParagraphStyle('title', fontName='Display', fontSize=29, leading=33, textColor=INK, spaceAfter=14),
    'heading': ParagraphStyle('heading', fontName='Display', fontSize=19, leading=23, textColor=INK, spaceBefore=9, spaceAfter=10),
    'label': ParagraphStyle('label', fontName='Bold', fontSize=8, leading=12, textColor=ACCENT, spaceAfter=9),
    'card': ParagraphStyle('card', fontName='Bold', fontSize=11, leading=15, textColor=INK, spaceAfter=8),
}

def clean(value):
    # Match the print typography rule while preserving other supported characters.
    value = str(value)
    for char in '\u2010\u2011\u2012\u2013\u2014\u2212':
        value = value.replace(char, '-')
    value = ' '.join(value.split())
    supported = pdfmetrics.getFont('Body').face.charToGlyph
    return ''.join(c if ord(c) in supported else f'[U+{ord(c):04X}]' for c in value)

def p(value, style='body'):
    return Paragraph(escape(clean(value)), STYLES[style])

def excerpt(value, limit):
    value = clean(value)
    return value[:limit] + ('...' if len(value) > limit else '')

def engine(value):
    return {'chatgpt': 'ChatGPT', 'perplexity': 'Perplexity', 'google': 'Google', 'copilot': 'Copilot'}.get(value, value)

def date(value):
    try:
        return datetime.fromisoformat(value.replace('Z', '+00:00')).strftime('%d %b %Y')
    except (ValueError, TypeError, AttributeError):
        return 'Date not verified'

class CountDots(Flowable):
    def __init__(self, numerator, denominator):
        super().__init__()
        self.n, self.total = numerator, denominator
        self.width, self.height = WIDTH, 52

    def draw(self):
        c = self.canv
        if self.total <= 32:
            for index in range(self.total):
                c.setStrokeColor(MUTED)
                c.setFillColor(ACCENT if index < self.n else colors.white)
                c.circle(9 + index * 16, 34, 5, fill=1, stroke=1)
        else:
            c.setFillColor(LINE); c.rect(0, 25, WIDTH, 14, fill=1, stroke=0)
            c.setFillColor(ACCENT); c.rect(0, 25, WIDTH * self.n / self.total, 14, fill=1, stroke=0)
        c.setFillColor(MUTED); c.setFont('Body', 8.5)
        c.drawString(0, 8, 'Filled = literal brand mention. Unfilled = no literal mention in the saved text.')

def frame(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(INK); canvas.setFont('DisplayBold', 20)
    canvas.drawString(46, 752, 'MindLever')
    offset = pdfmetrics.stringWidth('MindLever', 'DisplayBold', 20)
    canvas.setFillColor(ACCENT); canvas.drawString(46 + offset, 752, 'X.')
    canvas.setFont('Bold', 8); canvas.setFillColor(MUTED)
    canvas.drawRightString(566, 758, 'SAVED ANSWER REVIEW')
    canvas.setStrokeColor(LINE); canvas.line(46, 736, 566, 736)
    canvas.setFillColor(ACCENT); canvas.setFont('Bold', 8)
    canvas.drawString(46, 719, 'LOCAL DRAFT / NOT A COMPLETED AUDIT OR APPROVED CLIENT REPORT')
    canvas.setStrokeColor(LINE); canvas.line(46, 43, 566, 43)
    canvas.setFillColor(MUTED); canvas.setFont('Body', 8)
    canvas.drawString(46, 28, 'MindLeverX / Saved observations / No new collection')
    canvas.drawRightString(566, 28, f'{doc.page:02d}')
    canvas.restoreState()

def render(data):
    if data.get('state') != 'complete' or not data.get('answers'):
        raise ValueError('Complete report required')
    answers, platforms = data['answers'], data['platforms']
    if len(answers) > 128 or len(platforms) > 12 or len(data['brand']) > 120:
        raise ValueError('Report exceeds this local renderer capacity')
    n, total = data['aggregate']['numerator'], data['aggregate']['denominator']
    if total != len(answers) or n != sum(a['literalMention'] is True for a in answers):
        raise ValueError('Count contract mismatch')
    output = io.BytesIO()
    doc = SimpleDocTemplate(output, pagesize=(612, 792), leftMargin=46, rightMargin=46, topMargin=102, bottomMargin=61,
                            title=f'{clean(data["brand"])} - saved answer review', author='MindLeverX',
                            subject='Local draft based on saved vendor observations; not a completed audit', pageCompression=1)
    story = []
    add = story.extend
    finding = f'{data["brand"]} was not named in these {total} saved answers.' if n == 0 else f'{data["brand"]} was named in {n} of {total} saved answers.'
    dates = sorted({a['vendorTimestamp'] for a in answers if a['vendorTimestamp'] and date(a['vendorTimestamp']) != 'Date not verified'})
    period = f'{date(dates[0])} to {date(dates[-1])}' if dates else 'Not verified'
    add([p('01 / THE FINDING', 'label'), p(finding, 'title'), p(f'Vendor date range: {period}. This range describes saved records, not a new measurement run.', 'small')])
    stats = Table([[p(f'{n} / {total}', 'title'), p(str(len(platforms)), 'title'), p(str(data['questionCount']), 'title')],
                   [p('Answers with a literal mention', 'small'), p('Vendor platform labels', 'small'), p('Questions in this sample', 'small')]], colWidths=[220, 150, 150])
    stats.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),SOFT),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),14),('TOPPADDING',(0,0),(-1,0),14),('BOTTOMPADDING',(0,-1),(-1,-1),8)]))
    add([stats, Spacer(1, 15), CountDots(n,total), p('What this means', 'heading'),
         p(f'The literal text “{data["brand"]}” appears in {n} of {total} exported answers. This measures a narrow saved sample. It does not establish overall AI visibility, citations, sentiment or a trend.'),
         p('Mentions by platform', 'heading')])
    rows = [[p('VENDOR LABEL','label'), p('MATCHING ANSWERS','label'),p('SUPPORTING ROWS','label')]]
    for item in platforms:
        ids = [a['row'] for a in answers if a['engine'] == item['engine']]
        links = ', '.join(f'<link href="#row-{i}" color="#932c21">{i}</link>' for i in ids)
        rows.append([p(engine(item['engine'])), p(f'{item["numerator"]} / {item["denominator"]}'), Paragraph(links,STYLES['small'])])
    table = Table(rows, colWidths=[166,160,194], repeatRows=1, hAlign='LEFT')
    table.setStyle(TableStyle([('LINEBELOW',(0,0),(-1,-1),.5,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),5)]))
    add([table, Spacer(1,12), p('Counts are based on the full answer text. The numbered links lead to the evidence ledger. Vendor labels do not verify whether collection used a consumer product or a model API.', 'small'), PageBreak()])
    add([p('02 / CONTEXT & NEXT STEP','label'),p('Know what this sample can support.','title'),
         p('Measurement context','heading')])
    context = [
        ('Scope',f'{total} exported records; {data["questionCount"]} distinct question(s). All attempts and collection failures are unknown.'),
        ('Collection',f'Vendor dates: {period}. Method, consumer/API surface, model, session, locale and timestamp precision are unverified.'),
        ('Question panel','No qualified panel version supplied. Question text appears beside each evidence excerpt.'),
        ('Counting rule',f'Case-insensitive literal substring “{data["brand"]}” in answer text only; one count per matching answer. No aliases, spaced variants, sentiment or citation analysis.'),
        ('Data quality',f'{sum(i["code"] == "repeated_vendor_response_id" for i in data["issues"])} repeated response-ID warnings; records retained. Repeated IDs across platforms do not establish independent observations.'),
    ]
    table = Table([[p(label,'card'),p(value)] for label,value in context],colWidths=[108,412],hAlign='LEFT')
    table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,-1),.5,LINE),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),4)]))
    add([table,p('Next action: validate before choosing a fix.','heading'),
         p('Confirm the collection method, reporting permissions and whether the questions reflect the intended buyer decisions. The current sample does not justify a website or content change.'),
         p('Basis: the limited question coverage and unverified context above. Confidence in broader visibility is not established. Effort is not yet estimated. Dependency: qualified collection and question scope. Reversibility: review only; no customer-site change.', 'small'),
         p('Source identity & limits','heading'),
         p(f'SHA-256: {data["source"]["sha256"]}', 'small'),
         p(f'Source size: {data["source"]["bytes"]:,} bytes. Counting method: {data["method"]}. The hash identifies the saved bytes; it does not authenticate the vendor process.', 'small'),
         p('Retention/reporting rights still require review. Website readiness, traffic, leads, revenue and comparable change have not been measured. This PDF does not authorize customer release.','small'),
         p('Excerpt display: whitespace collapsed and typographic dashes rendered as hyphens. Unsupported characters use U+ escapes. An ellipsis marks a shortened excerpt. Full source bytes remain unchanged.','small'),PageBreak()])
    for offset in range(0,len(answers),3):
        group = answers[offset:offset+3]
        add([p('03 / SUPPORTING EVIDENCE','label'),p(f'Answer records {group[0]["row"]}-{group[-1]["row"]}','heading'),
             p('Excerpts identify the source; counting uses the full answer. Full text is available in the local results page under the same row number. These vendor claims are not endorsed.','small')])
        for row in group:
            title = f'Row {row["row"]} / {engine(row["engine"])} / {"Literal mention" if row["literalMention"] else "No literal mention"}'
            heading = Paragraph(f'<a name="row-{row["row"]}"/>' + escape(clean(title)),STYLES['card'])
            content = [heading,
                p(f'Vendor timestamp: {row["vendorTimestamp"] or "Not supplied"}', 'small'),
                p(f'Question excerpt: {excerpt(row["prompt"],180)}','small'),
                p(f'Answer excerpt: {excerpt(row["answer"],300)}'),
                p(f'Vendor response ID: {row["vendorResponseId"] or "Not supplied"}', 'small')]
            card = Table([[content]],colWidths=[WIDTH],hAlign='LEFT')
            card.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),SOFT),('BOX',(0,0),(-1,-1),.5,LINE),('LEFTPADDING',(0,0),(-1,-1),13),('RIGHTPADDING',(0,0),(-1,-1),13),('TOPPADDING',(0,0),(-1,-1),11),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
            add([KeepTogether([card,Spacer(1,12)])])
        if offset + 3 < len(answers):
            story.append(PageBreak())
    doc.build(story,onFirstPage=frame,onLaterPages=frame)
    return output.getvalue()

if __name__ == '__main__':
    try:
        raw = sys.stdin.buffer.read(4 * 1024 * 1024 + 1)
        if len(raw) > 4 * 1024 * 1024:
            raise ValueError('Input too large')
        sys.stdout.buffer.write(render(json.loads(raw)))
    except Exception:
        print('PDF generation failed.',file=sys.stderr)
        sys.exit(1)
