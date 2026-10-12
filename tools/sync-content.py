from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
source=root.parent/'PhilMission/app/src/main/assets/content.json'
content=json.loads(source.read_text(encoding='utf-8-sig'))
assert len(content['phrases'])==50 and len(content['worship'])==4
content['contacts']=[]
(root/'public/content.json').write_text(json.dumps(content,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Synced public mission content without default contacts:',len(content['phrases']),'phrases')
