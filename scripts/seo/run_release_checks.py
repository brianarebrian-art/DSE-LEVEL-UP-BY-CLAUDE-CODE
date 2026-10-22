#!/usr/bin/env python3
"""Run existing repository gates and record each exit code without hiding failures."""
import argparse
import datetime
import json
import subprocess
from pathlib import Path

CHECKS = [('lint', ['npm','run','lint','--','--max-warnings=0']), ('test',['npm','test']), ('qa',['npm','run','qa']), ('build',['npm','run','build'])]

def main():
    cli=argparse.ArgumentParser();cli.add_argument('--output',required=True);args=cli.parse_args()
    output=Path(args.output);output.mkdir(parents=True,exist_ok=True)
    results=[]
    for name,command in CHECKS:
        print(f'START {name}',flush=True)
        start=datetime.datetime.now(datetime.timezone.utc).isoformat()
        path=output/f'{name}.log'
        with path.open('w') as log:
            result=subprocess.run(command,stdout=log,stderr=subprocess.STDOUT,check=False)
        record={'name':name,'command':command,'exit_code':result.returncode,'started_at':start,'finished_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'log':str(path)}
        results.append(record)
        (output/'checks.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
        print(f'END {name}: exit={result.returncode}',flush=True)
    raise SystemExit(1 if any(r['exit_code']for r in results)else 0)

if __name__=='__main__':main()
