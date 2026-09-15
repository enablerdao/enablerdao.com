"""Publish the approved release preview and manuscript, not internal review notes."""
from pathlib import Path
import sys
import shutil

root = Path(__file__).resolve().parent.parent
source = Path(sys.argv[1])
output = root / 'static/portfolio'
text = (source / 'prtimes-preview.html').read_text()
for old, new in [('media/', '/static/portfolio/media/'), ('prtimes-preview.pdf', '/static/portfolio/release-preview.pdf'), ('PRTIMES-RELEASE-JA.md', '/static/portfolio/release-manuscript.txt')]:
    text = text.replace('"' + old, '"' + new)
assert '/Users/' not in text and 'file://' not in text
(output / 'release-preview.html').write_text(text)
(output / 'release-manuscript.txt').write_text((source / 'PRTIMES-RELEASE-JA.md').read_text())
shutil.copyfile(source / 'prtimes-preview.pdf', output / 'release-preview.pdf')
print('Imported release preview, PDF and manuscript')
