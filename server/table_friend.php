<?php
	include_once './database.php';

	/**
	* 
	*/
	class Friend extends Database
	{
		
		function __construct()
		{
			if (!$this->getConnect()) {
				echo "connect error";
				exit;
			}
		}
		

		//查
		public function has($self_uid,$friend_uid)
		{
			$sql = "SELECT * FROM `friend` WHERE self_uid = '$self_uid' AND friend_uid = '$friend_uid'";
			$return = $this->query($sql);
			if(count($return) == 0)return false;
			else return true;
		}
		public function findOneAll($uid)
		{
			$sql = "SELECT * FROM `friend` WHERE self_uid = '$uid'";
			$return = $this->query($sql);
			if(count($return)==0)return "";
			else return $return;
		}
		public function findOneFriend($uid)
		{
			$sql = "SELECT `friend_uid` ,`nickName` ,`friend_head_url` FROM `friend` WHERE self_uid = '$uid'";
			$return = $this->query($sql);
			if(count($return)==0)return "";
			else return $return;
		}


		// //增
		public function insert($self_uid,$friend_uid,$nickName,$friend_head_url)
		{
			$sql = "INSERT INTO `friend` (`self_uid` ,`friend_uid` ,`nickName`,`friend_head_url` )VALUES ('$self_uid', '$friend_uid', '$nickName','$friend_head_url')";
			$return = $this->execute($sql);
			if($return == 1)return true;
			else return false;
			
		}

		// //删
		public function delete($self_uid,$friend_uid)
		{
			$sql = "DELETE FROM `friend` WHERE `self_uid` = '$self_uid' AND `friend_uid` = '$friend_uid'";
			$return = $this->execute($sql);
			return true;
		}

		


	}
	
?>