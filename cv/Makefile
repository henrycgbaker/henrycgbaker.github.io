# CV Makefile
# Requires: xelatex (part of TeX Live or MacTeX)

MAIN = cv
TEX = xelatex
FLAGS = -interaction=nonstopmode -halt-on-error

.PHONY: all clean watch

all: $(MAIN).pdf

$(MAIN).pdf: $(MAIN).tex
	$(TEX) $(FLAGS) $(MAIN).tex
	$(TEX) $(FLAGS) $(MAIN).tex  # Run twice for references

clean:
	rm -f *.aux *.log *.out *.synctex.gz

# Watch for changes and recompile (requires fswatch on macOS)
watch:
	fswatch -o $(MAIN).tex | xargs -n1 -I{} make all
