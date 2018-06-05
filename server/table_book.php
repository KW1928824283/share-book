<?php
	include_once './database.php';

	/**
	* 
	*/
	class Book extends Database
	{
		
		function __construct()
		{
			if (!$this->getConnect()) {
				echo "connect error";
				exit;
			}
		}
		//查
		public function findBooksByOpenid($openid)
		{
			// $sql = "SELECT * FROM User";
			$sql = "SELECT * FROM book WHERE openid = '$openid'";
			$return = $this->query($sql);
			if(count($return)==0)return "";
			else return $return;
			

		}
		public function findDetailBooksByOpenid($openid)
		{
			// $sql = "SELECT * FROM User";
			$sql = "SELECT * FROM book WHERE openid = '$openid'";
			$return = $this->query($sql);
			if(count($return)==0)return "";
			else return $return;
			

		}
		public function findBooksByISBN($isbn)
		{
			// $sql = "SELECT * FROM User";
			$sql = "SELECT * FROM `book`   WHERE book_isbn = '$isbn'";
			$return = $this->query($sql);
			if(count($return)==0)return "";
			else return $return;
			

		}
		public function findABookByOpenidAndISBN($openid,$isbn)
		{
			$sql = "SELECT * FROM `book` WHERE `book_isbn` = '$isbn' AND `openid` = '$openid' ";
			$return = $this->query($sql);
			if(count($return)==0)return "";
			else return $return[0];
		}
		public function hasBook($openid,$isbn)
		{
			$sql = "SELECT * FROM `book` WHERE `book_isbn` = '$isbn' AND `openid` = '$openid'";
			$return = $this->query($sql);
			if(count($return) == 0) return false;
			else return true;
		}




		//增
		public function addBookByOpenid($openid,$bookInfo)
		{
			$title = $bookInfo["title"];
			$author = $bookInfo["author"];
			$book_cover = $bookInfo["book_cover"];
			$book_isbn = $bookInfo["book_isbn"];
			$book_info = $bookInfo["book_info"];
			$price = (trim($bookInfo["price"]) == "")?0:trim($bookInfo["price"]);
			$publisher = $bookInfo["publisher"];
			$pages = (trim($bookInfo["pages"]) == "")?0:trim($bookInfo["pages"]);
			$binding = $bookInfo["binding"];
			$pubdate = $bookInfo["pubdate"];
			$tags = $bookInfo["tags"];
			$tags = implode(",", $tags);
			// $tags = json_encode($tags,true);
			// $sql = "SELECT * FROM User";
			$sql = "INSERT INTO `book` (`openid`, `book_isbn`, `title`, `author`, `book_cover`, `book_info`, `price`, `publisher`, `pages`, `binding`, `pubdate`, `tags`,`num`,`status`) VALUES ('$openid', '$book_isbn', '$title', '$author', '$book_cover', '$book_info', '$price', '$publisher', '$pages', '$binding', '$pubdate', '$tags',1,'0')";
			$return = $this->execute($sql);
			return $return; 
			// ($return == 1)?1:0 ;

			

		}

		
		



		

		//删
		public function delete($openid,$isbn)
		{
			$sql = "DELETE FROM `book` WHERE `openid` = '$openid' AND `book_isbn` = '$isbn'";
			$return = $this->execute($sql);
			return ($return == 1)?1:0;
		} 

		public function SetNum($openid,$isbn,$num)
		{
			$sql = "UPDATE `book` SET `num` = '$num' WHERE `openid` = '$openid' AND `book_isbn` = '$isbn'";
			$return = $this->execute($sql);
			return $return == 1?1:0;
			
		}

		public function update($openid,$isbn,$bookInfo)
		{
			$title = $bookInfo["title"];
			$author = $bookInfo["author"];
			$book_cover = $bookInfo["book_cover"];
			$book_isbn = $bookInfo["book_isbn"];
			$book_info = $bookInfo["book_info"];
			$price = (trim($bookInfo["price"]) == "")?0:trim($bookInfo["price"]);
			$publisher = $bookInfo["publisher"];
			$pages = (trim($bookInfo["pages"]) == "")?0:trim($bookInfo["pages"]);
			$binding = $bookInfo["binding"];
			$pubdate = $bookInfo["pubdate"];
			$tags = $bookInfo["tags"];
			$sql = "UPDATE `book` SET   `title` = '$title', `author` = '$author', `book_cover` = '$book_cover', `book_info` = '$book_info', `price` = '$price', `publisher` = '$publisher', `pages` = '$pages', `binding` = '$binding', `pubdate` = '$pubdate', `tags` = '$tags', `num` = '$num' WHERE `openid` = '$openid' AND `book_isbn` = '$book_isbn'";
			$return = $this->execute($sql);
			return $return;
		}

		public function updateCover($openid,$isbn,$cover)

		{
			$sql = "UPDATE `book` SET `book_cover` = '$cover' WHERE `openid` = '$openid' AND `book_isbn` = '$isbn' ";
			$return = $this->execute($sql);
			return $return;
		}
		public function updateBookInfo($openid,$isbn,$book_info)
		{
			$sql = "UPDATE `book` SET `book_info` = '$book_info' WHERE `openid` = '$openid' AND `book_isbn` = '$isbn' ";
			$return = $this->execute($sql);
			return $return;
		}
		public function updateBookTags($openid,$isbn,$tags)
		{
			$tags = implode(",", $tags);
			$sql = "UPDATE `book` SET `tags` = '$tags' WHERE `openid` = '$openid' AND `book_isbn` = '$isbn' ";
			$return = $this->execute($sql);
			return $return;
		}
		public function updateBookStatus($openid,$isbn,$status)
		{
			$sql = "UPDATE `book` SET `status` = '$status' WHERE `openid` = '$openid' AND `book_isbn` = '$isbn'";
			$return = $this->execute($sql);
			if ($return == 1)return true;
			else return false;
		}


	}
	
?>