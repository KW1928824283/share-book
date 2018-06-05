<?php
include_once './table_book.php';
if ($_SERVER["REQUEST_METHOD"] =="POST") {
        
        $fun = $_POST["fun"];
        switch ($fun) {
        	case 'addBookNet':
        		$openid = $_POST["openid"];
        		$bookInfo = $_POST["bookInfo"];
        		$bookInfoArr = json_decode($bookInfo,true);


        		addBookNet($openid,$bookInfoArr);
        		break;
        	case 'addBookMy':
                $openid = $_POST["openid"];
                $bookInfo = $_POST["bookInfo"];
                $bookInfoArr = json_decode($bookInfo,true);
                $file = $_FILES['photos']; 
                addBookMy($openid,$bookInfoArr,$file);
                break;
            case 'BookList':
                $openid = $_POST["openid"];
                BookList($openid);
                break;
            case 'bookDetail':
                $openid = $_POST["openid"];
                $isbn  = $_POST["isbn"];
                bookDetail($openid,$isbn);
                break;
            
        	default:
        		# code...
        		break;
        }
    }else if($_SERVER["REQUEST_METHOD"] =="GET"){
        $fun = $_GET["fun"];
        switch ($fun) {
            case 'getBookInfo':
                $isbn = $_GET["code"];
                // echo $isbn."HEllo";
                getBookInfo($isbn);
                break;
            // case 'deleteBook':
            // 	$openid = $_GET["openid"];
            // 	$isbn = $_GET["isbn"];
            // 	deleteBook($openid,$isbn);
            // 	break;
            // case 'lendBookInfo':
            	
            // 	break;
            default:
                # code...
                break;
        }
    }
// function deleteBook($openid,$isbn)
// {
// 	$obj = new Book();
// 	$return = $obj->delete($openid,$isbn);
// 	echo $return;
	
// }

function bookDetail($openid,$book_isbn)
{
    $obj = new Book();
    $return = $obj->findABookByOpenidAndISBN($openid,$book_isbn);
    $arr= array();
    $arr = explode(",", $return["tags"]);
    $return["tags"] = $arr;
    $return = json_encode($return,true);
    echo $return;
}
function BookList($openid)
{
    $obj = new Book();
    $return = $obj->findBooksByOpenid($openid);
    $return = json_encode($return,true);
    echo $return;
}
function addBookNet($openid,$bookInfo)
{
    $rootUrl = "http://www.chdbwtx.cn/server/";
 	$obj = new Book();
 	$isbn = $bookInfo["book_isbn"];
 	if ($obj->hasBook($openid,$isbn)) {
 		echo "has";
 	}else{

 		
	    makDir($openid);
	    $path = $bookInfo["book_cover"];
	    $isbn = $bookInfo["book_isbn"];
	    $newPath =  $rootUrl.saveImage($path,$openid,$isbn);
	    $bookInfo["book_cover"] = $newPath;
	 	$return = $obj->addBookByOpenid($openid,$bookInfo);
	 	
	 	if($return)
	 	{
	 		echo 1;	
	 	}else{
	 		$ret =  $obj->delete($openid,$isbn);
	 		
	 		echo 0;
	 	}
 	}
 	
 	
 }
 function addBookMy($openid,$bookInfo,$file)
 {
    $rootUrl = "http://www.chdbwtx.cn/server/";
    $obj = new Book();
    makDir($openid);
    $isbn = $bookInfo["book_isbn"];
    $newPath =  $rootUrl.saveImageMy($file,$openid,$isbn);
    $bookInfo["book_cover"] = $newPath;

    $return = $obj->addBookByOpenid($openid,$bookInfo);

    if($return)
 	{
 		echo 1;	
 	}else{
 		$ret =  $obj->delete($openid,$isbn);
 		echo 0;
 	}
 }

function getBookInfo($isbn) 
{
 
    $url = "https://api.douban.com/v2/book/isbn/:".$isbn;
       
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HEADER, 0);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
    $result = curl_exec($curl);
    curl_close($curl);
  
    $book_array = json_decode($result, true);
   
   
    if(!empty($book_array["title"])) {
      

        $book_title = $book_array["title"];
        $book_author = $book_array["author"][0];

        $book_cover = $book_array["image"];
        $book_isbn = $book_array["isbn13"]; // ISBN13
        $book_info = $book_array["summary"];  
        $book_price = $book_array["price"];  
        $book_publisher = $book_array["publisher"];
        $book_pages  = $book_array["pages"];
        $book_binding = $book_array["binding"];
        $tags = $book_array["tags"];
        $book_tags = $tags;
        $book_tags = array();
        for($i = 0;$i<count($tags);$i++)
        {
            
            $book_tags[] = $tags[$i]["name"];
        }
       
        $book_pubdate = $book_array["pubdate"];
        $book = array(
                        "title"=>$book_title,
                        "author"=>$book_author,
                        "book_cover"=>$book_cover,
                        "book_isbn"=>$book_isbn,
                        "book_info"=>$book_info,
                        "price"=>$book_price,
                        "publisher" => $book_publisher,
                        "pages"=>$book_pages,
                        "binding"=>$book_binding,
                        "pubdate" =>$book_pubdate,
                        "tags" => $book_tags
                        
                    );
        echo  json_encode($book,true);
    }else{
        echo  "nobooks";
    }
   
}
function makDir($openid)
{
    $dir = iconv("UTF-8", "GBK", "UserBookImg/".$openid);

    if (!file_exists($dir)){
        mkdir($dir,0777,true);
    }
}
function saveImage($path,$openid,$isbn) {
    
    if(!preg_match('/\/([^\/]+\.[a-z]{3,4})$/i',$path,$matches))
    die('Use image please');
    $path_name = strToLower($matches[1]);
    $arr = explode(".", $path_name);
    $lastName =  ".".$arr[count($arr)-1];


    $image_name = $isbn.$lastName;
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $path);
    curl_setopt($curl, CURLOPT_HEADER, 0);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
    $img = curl_exec($curl);
    curl_close($curl);
    $fp = fopen("UserBookImg/".$openid."/".$image_name,'w');
    fwrite($fp, $img);
    fclose($fp);

    return "UserBookImg/".$openid."/".$image_name;


}
function saveImageMy($file,$openid,$isbn)
{
    $path = $file["tmp_name"];
    $type = $file["type"];
    $arr = explode("/", $type);
    $lastName  = ".".$arr[count($arr)-1];
    $image_name = $isbn.$lastName;
    //将数据传输到$img变量中
    $fp0 = fopen($path,'r');
    $img =  fread($fp0, filesize($path));
    fclose($fp0);


    //保存图片
    $fp = fopen("UserBookImg/".$openid."/".$image_name,'w');
    fwrite($fp, $img);
    fclose($fp);
    return "UserBookImg/".$openid."/".$image_name;
}

?>