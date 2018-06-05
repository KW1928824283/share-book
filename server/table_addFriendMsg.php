<?php
	include_once './database.php';

	/**
	* 
	*/
	class AddFriendMsg extends Database
	{
		
		function __construct()
		{
			if (!$this->getConnect()) {
				echo "connect error";
				exit;
			}
		}
		

		//查

		public function find($resUid)
		{
			$sql = "SELECT * FROM `addfriendmsg` WHERE 	`resUid`='$resUid'";
			$return = $this->query($sql);
			return $return;
		}

		public function has($reqUid,$resUid)
		{

			$sql = "SELECT * FROM `addfriendmsg` WHERE `reqUid` = '$reqUid' AND `resUid` = '$resUid' ";
			$return = $this->query($sql);
			if(count($return)==0)return false;
			else return true;
		}

		// //增
		public function insrt($reqUid,$resUid,$reqDesc,$remarkName,$time,$reqName,$req_head_url,$res_head_url)
		{
			$sql = "INSERT INTO `addfriendmsg` (`reqUid`, `resUid`, `reqDesc`, `remarkName`, `time`,`reqName`,`req_head_url`,`res_head_url`) VALUES ('$reqUid', '$resUid', '$reqDesc', '$remarkName', '$time','$reqName','$req_head_url','$res_head_url')";
			$return = $this->execute($sql);
			if ($return == 1) return true;
				else return false;
		}


		// //改
		public function  update($reqUid,$resUid,$reqDesc,$remarkName,$time,$reqName)
		{
			
			$sql = "UPDATE `addfriendmsg` SET `reqDesc` = '$reqDesc',`remarkName` = '$remarkName',`time` = '$time',`reqName` = '$reqName' WHERE `reqUid` = '$reqUid' AND `resUid` = '$resUid'";
			$return = $this->execute($sql);
			return true;
		}

		public function delete($resUid)
		{
			$sql = "DELETE FROM `addfriendmsg` WHERE  `resUid` = '$resUid'";
			$return = $this->execute($sql);
			return true;
		}
		




	}
	
	
?>