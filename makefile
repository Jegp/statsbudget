all:
	./Fetch > js/data.js

compile:
	ghc scripts/Fetch.hs -O2 -o Fetch