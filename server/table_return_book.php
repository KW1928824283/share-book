<?php
	include_once './database.php';

	/**
	* 
	*/
	class RetBookMsg extends Database
	{
		
		function __construct()
		{
			if (!$this->getConnect()) {
				echo "connect error";
				exit;
			}
		}
		//查
		public function find($reqUid)
		{
			// $sql = "SELECT * FROM User";
			$sql = "SELECT * FROM `retbookmsg`  WHERE `reqUid` = '$reqUid'";
			$return = $this->query($sql);
			if(count($return)==0)return "";
			else return $return;
			

		}




		public function has($reqUid,$resUid,$book_isbn)
		{

			$sql = "SELECT * FROM `retbookmsg` WHERE `reqUid` = '$reqUid' AND `resUid` = '$resUid' AND `book_isbn`='$book_isbn'";
			$return = $this->query($sql);
			if(count($return)==0)return false;
			else return true;
		}


		public function insert($reqUid,$resUid,$book_isbn,$time,$reqNickName,$title,$author,$book_cover)
		{
			$sql = "INSERT INTO `retbookmsg` (`reqUid`, `resUid`, `book_isbn`, `mark`, `time`, `reqNickName`, `title`, `author`, `book_cover`) VALUES ('$reqUid', '$resUid', '$book_isbn', '', '$time', '$reqNickName', '$title', '$author', '$book_cover')";
			$return = $this->execute($sql);
			if ($return == 1) return true;
				else return false;
		}




		// //改
		public function  update($reqUid,$resUid,$book_isbn,$time)
		{
			
			$sql = "UPDATE `retbookmsg` SET `mark` = '',`time` = '$time' WHERE `reqUid` = '$reqUid' AND `resUid` = '$resUid' AND `book_isbn` = '$book_isbn'";
			$return = $this->execute($sql);
			return true;
		}
		//删
		public function delete($reqUid)
		{
			$sql = "DELETE FROM `retbookmsg` WHERE  `reqUid` = '$reqUid'";
			$return = $this->execute($sql);
			return true;
		}




	}
	
?>