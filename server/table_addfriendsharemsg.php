<?php 
	include_once './database.php';
	/**
	* 
	*/
	class addShare  extends Database
	{
		
		function __construct()
		{
			if (!$this->getConnect()) {
				echo "connect error";
				exit;
			}
		}
		public function has($reqUid,$time)
		{

			$sql = "SELECT * FROM `addfriendsharemsg` WHERE `reqUid` = '$reqUid' AND `time` = '$time'";
			$return = $this->query($sql);
			if (count($return) == 0) return false;
			else return true;
		}
		public function insert($reqUid,$time)
		{
			$sql =  "INSERT INTO `addfriendsharemsg` (`reqUid`, `time`) VALUES ('$reqUid', '$time')";
			$return = $this->execute($sql);
			if($return == 1)return true;
			else return false;
		}


		public function delete($reqUid,$time)
		{
			$sql = "DELETE FROM `addfriendsharemsg` WHERE `reqUid` = '$reqUid' AND `time` = '$time'";
			$return = $this->execute($sql);
			return true;
		}
	}
 ?>