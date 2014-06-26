import Data.Char
import Data.List
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
  filter
    (\x -> length x > 0 &&
           (startswith "\167" (x !! 0))) list

formatNumber n = case n of
                      "" -> "0"
                      x  -> replace "," "." x

sumStr str1 str2 = show $ (read str1 :: Double) + (read str2 :: Double)

toItem :: [String] -> String -> String
toItem list year =
  let name     = year ++ "-" ++ (list !! 0) in
  let income   = formatNumber (list !! 4) in
  let expenses = formatNumber (list !! 5) in
  let total    = sumStr income expenses in
  concat ["\n{\"id\": \"", name, "\",",
             "\"name\": \"", (list !! 0), "\",",
             "\"data\": {\"total\":", total, ",",
                        "\"$area\":", total, "},",
             "\"children\": [",
                             "{\"id\":", "\"in-", name, "\",",
                             "\"name\": \"", name, " - Udgifter\"",
                             "\"data\": {",
                                         "\"expenses\":", expenses,",",
                                         "\"$area\":", expenses, "}},",
                             "{\"id\":", "\"out-", name, "\",",
                             "\"name\": \"", name, " - Indtægter\"",
                             "\"data\": {",
                                         "\"income\":", income,",",
                                         "\"$area\":", income, "}}",
             "]",
          "}\n"]

toJSON :: String -> [[String]] -> String
toJSON year list =
  "var bonjovi = {\"name\": " ++ year ++ ", \"children\": [" ++
  intercalate "," (map (\x -> toItem x year) list)
  ++ "]}"

outputJSON year =
  getData Grant year "HOVEDOVERSIGT" >>= putStr . (toJSON (show year)) . parse

main = outputJSON 13