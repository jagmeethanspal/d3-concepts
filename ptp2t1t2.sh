#!/usr/bin/bash
cat $1 | grep -i sync | cut -d'(' -f3 | cut -d')' -f1 | tr ':' . > t1.txt
cat $1 | grep -i sync | cut -d'(' -f2 | cut -d')' -f1 | tr ':' . > t2.txt
echo "t1,t2" > $2
paste t1.txt t2.txt | tr '\t' ',' | tr ' ' '0' >> $2
rm t1.txt
rm t2.txt

