import Data.List.Split
import Data.String.Utils
import Data.Char (isSpace)
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

trim = f . f
  where f = reverse . dropWhile isSpace

parse :: String -> [[String]]
parse src =
  let html = innerText $ dropWhile (~/= "<pre>") $ parseTags src in
  let text = filter (\x -> x /= '-' && x /= '.' && x /= '+') html in
  let list = map (map trim) $ map (splitOn "|") $ splitOn "\n" text  in
  filter (\x -> length x > 0 && (startswith "\167" (x !! 0) || startswith "I alt" (x !! 0))) list

main = getData Grant 13 "HOVEDOVERSIGT" >>= putStr . show . parse