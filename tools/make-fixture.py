from pathlib import Path
objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 400] /Resources << /Font << /F1 5 0 R >> >> /Contents 6 0 R >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 400] /Resources << /Font << /F1 5 0 R >> >> /Contents 7 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>']
for text in ['PAGE ONE','PAGE TWO']:
 stream=f'BT /F1 24 Tf 40 320 Td ({text}) Tj ET';objects.append(f'<< /Length {len(stream)} >>\nstream\n{stream}\nendstream')
out=b'%PDF-1.4\n';offsets=[0]
for i,obj in enumerate(objects,1):offsets.append(len(out));out+=f'{i} 0 obj\n{obj}\nendobj\n'.encode()
xref=len(out);out+=f'xref\n0 {len(objects)+1}\n0000000000 65535 f \n'.encode()
for n in offsets[1:]:out+=f'{n:010} 00000 n \n'.encode()
out+=f'trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF'.encode();Path('C:/Claude/PRJ/PhilMission_WebApp/tests/fixture.pdf').write_bytes(out)
