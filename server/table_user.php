<?php
	include_once './database.php';

	/**
	* 
	*/
	class User extends Database
	{
		
		function __construct()
		{
			if (!$this->getConnect()) {
				echo "connect error";
				exit;
			}
		}
		

		//查

		public function findOneMsg($uid,$password)
		{
			$sql = "SELECT * FROM `user` WHERE uid = '$uid' AND password = '$password'";
			$return = $this->query($sql);
			if(count($return)==0)return "";
			else return $return[0];
		}

		public function searchFri($searchId)
		{
			$sql = "SELECT `uid`,`nickName`,`head_url` FROM `user` WHERE uid LIKE '%$searchId%' limit 3";
			$return = $this->query($sql);
			return $return;
		}

		//增
		public function insertOne ($uid,$password,$nickName,$head_url)
		{
			$sql = "INSERT INTO `user` (`uid`, `password`, `nickName`,`head_url`) VALUES ('$uid', '$password', '$nickName','$head_url')";
			$return = $this->execute($sql);
			if ($return == 0) {
				return false;
			}else{
				return true;
			}
		}


	}
	
?>