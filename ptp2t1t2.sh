#!/usr/bin/bash
cat ptplog.txt | grep -i sync | cut -d'(' -f3 | cut -d')' -f1 > t1.txt
cat ptplog.txt | grep -i sync | cut -d'(' -f2 | cut -d')' -f1 > t2.txt
echo "t1,t2" > t1t2.csv
paste t1.txt t2.txt | tr '\t' , >> t1t2.csv
rm t1.txt
rm t2.txt

