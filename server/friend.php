<?php
	include_once './table_friend.php';
	if ($_SERVER["REQUEST_METHOD"] =="POST") {
		$fun = $_POST["fun"];
		switch ($fun) {
			case 'friendList':
				$uid = $_POST['uid'];
				friendList($uid);
				break;
			case 'addFriRes':
				$uid = $_POST['uid'];
				$password = $_POST['password'];
				Login($uid,$password);
				break;
			default:
				# code...
				break;
		}
	}else if($_SERVER['REQUEST_METHOD'] == "GET"){




		$fun = $_GET["fun"];
		switch ($fun) {
			case 'addFriRes':
				$msg = $_GET['msg'];
				addFriRes($msg);
				break;
			case 'hasFri':
				$self_uid =  $_GET['self'];
				$friend_uid = $_GET['friend'];
				hasFri($self_uid,$friend_uid);
				break;
			default:
				# code...
				break;
		}
	}
	function hasFri($self_uid,$friend_uid)
	{
		$obj = new Friend();
		if ($obj->has($self_uid,$friend_uid)) {
			echo true;
		}else{
			echo false;
		}
	}
	function addFriRes($msg)
	{
		$msg = json_decode($msg,true);
		$obj = new Friend();

		if($obj->has($msg["reqUid"],$msg["resUid"]) && $obj->has($msg["reqUid"],$msg["resUid"] ) ) {
			$array = array(
				"status"=>true,
				"msg"=>"has"
			);
			echo json_encode($array,true);
			return;
		}

		if ($obj->insert($msg["reqUid"],$msg["resUid"],$msg["remarkName"],$msg["req_head_url"]) && $obj->insert($msg["resUid"],$msg["reqUid"],$msg["resRemark"],$msg["res_head_url"])) {
			$array = array(
				"status"=>true,
				"msg"=>"ok"
			);
			echo json_encode($array,true);
		 }else{
		 	$obj->delete($msg["reqUid"],$msg["resUid"]);
			$obj->delete($msg["resUid"],$msg["reqUid"]);
			$array = array(
				"status"=>false,
				"msg"=>"err"
			);
			echo json_encode($array,true);
		 }
		 
	}

	function friendList($uid)
	{
		$obj = new Friend();
		$return = $obj->findOneFriend($uid);
		echo json_encode($return);
	}


?>