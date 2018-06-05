<?php
	include_once './database.php';

	/**
	* 
	*/
	class lendInfo extends Database
	{
		
		function __construct()
		{
			if (!$this->getConnect()) {
				echo "connect error";
				exit;
			}
		}
		

		//查
		
		public function findLendin($resUid)
		{

			$sql = "SELECT * FROM `lendinfo` WHERE resUid = '$resUid' AND lendstatus = 'lend'";

			$return = $this->query($sql);
			$result = array();
			for($i = 0;$i<count($return);$i++){
				$openid = $return[$i]["reqUid"];
				$book_isbn = $return[$i]["book_isbn"];
				$sql_p = "SELECT * FROM `book` WHERE openid = '$openid' AND book_isbn = '$book_isbn' ";
				$res = $this->query($sql_p);
				$newRes = $this->connet($return[$i],$res[0]);
				$result[] = $newRes;
			}
			if(count($result)==0)return "";
			else return $result;
		}

		public function findLendout($reqUid)
		{
			$sql = "SELECT * FROM `lendinfo` WHERE reqUid = '$reqUid' AND lendstatus = 'lend'";

			$return = $this->query($sql);
			$result = array();
			for($i = 0;$i<count($return);$i++){
				$openid = $return[$i]["reqUid"];
				$book_isbn = $return[$i]["book_isbn"];
				$sql_p = "SELECT * FROM `book` WHERE openid = '$openid' AND book_isbn = '$book_isbn' ";
				$res = $this->query($sql_p);
				$newRes = $this->connet($return[$i],$res[0]);
				$result[] = $newRes;
			}
			if(count($result)==0)return "";
			else return $result;
		}

		private function connet($infoArr,$bookArr)
		{
			$bookArr["reqNickName"] = $infoArr["reqNickName"];
			$bookArr["reqUid"] = $infoArr["reqUid"];
			$bookArr["time"] = $infoArr["time"];
			$bookArr["resUid"] = $infoArr["resUid"];

			return $bookArr;

		}
		


		// //增
		public function insert($msg)
		{
			$msg = json_decode($msg,true);
			$reqUid = $msg["reqUid"];
			$resUid = $msg["resUid"];
			$reqNickName = $msg["reqNickName"];
			$title = $msg["title"];
			$author = $msg["author"];
			$book_cover = $msg["book_cover"];
			$book_isbn = $msg["book_isbn"];
			$time =$msg["time"];
			$status = $msg["status"];
			$sql = "INSERT INTO `lendinfo` (`reqUid`, `resUid`, `reqNickName`, `title`, `author`, `book_cover`, `book_isbn`, `time`,`lendstatus`) VALUES ('$reqUid', '$resUid', '$reqNickName', '$title', '$author', '$book_cover', '$book_isbn', '$time','$status')";
			// echo $sql;
			$return = $this->execute($sql);
			if($return == 1)return true;
			else return false;
			
		}

		// //删
		public function delete($reqUid,$resUid,$book_isbn)
		{
			$sql = "DELETE FROM `lendinfo` WHERE `reqUid` = '$reqUid' AND `resUid` = '$resUid' AND `book_isbn` = '$book_isbn'";
			$return = $this->execute($sql);
			return true;
		}

		


	}
	
?>