import Network.HTTP
import Text.HTML.TagSoup

-- Data type for books
data Book = Grant
toBook Grant year = "book=BEVPUBL.R" ++ show year ++ "T"

-- Base url for the oes source
baseURL = "http://www.oes-cs.dk/bevillingslove/doctopic?"

-- Retrieves
getData :: Book -> Int -> String -> IO String
getData book year topic =
  let url = baseURL ++ toBook book year ++ "&topic=" ++ topic in
  simpleHTTP ( getRequest url ) >>= getResponseBody

parse :: String -> String
parse src = innerText $ dropWhile (~/= "<pre>") $  parseTags src

main = getData Grant 13 "HOVEDOVERSIGT" >>= putStr . parse