#!/bin/bash

URL="http://www.oes-cs.dk/bevillingslove/doctopic?book=BEVPUBL.R13T&topic=HOVEDOVERSIGT&searchtype=3"

wget $URL -O data

grep -oP '(?<=<pre>).*?(?=</pre>)' data > data2

sed 's/[\.\-]//g' data2 > tmp

cat tmp