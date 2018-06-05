<?php
	include_once './table_addFriendMsg.php';
	if ($_SERVER["REQUEST_METHOD"] =="POST") {
		$fun = $_POST["fun"];
		switch ($fun) {
			case 'addMsgRes':
				$resUid = $_POST["uid"];
				addMsgRes($resUid);
				break;
			default:
				# code...
				break;
		}
	}else if($_SERVER['REQUEST_METHOD'] == "GET"){

		$fun = $_GET["fun"];
		switch ($fun) {
			case 'addReq':
				$msg = $_GET["msg"];
				addReq($msg);
				break;
			
			default:
				# code...
				break;
		}
	}


	function addMsgRes($resUid)
	{
		$obj = new AddFriendMsg();
		$return = $obj->find($resUid);
		$obj->delete($resUid);
		echo json_encode($return);
	}
	 function addReq($msg)
	{
		
		$msg = json_decode($msg,true);

		$reqUid = $msg["reqUid"];
		$resUid = $msg["resUid"];
		$reqDesc = $msg["reqDesc"];
		$remarkName = $msg["remarkName"];
		$time = $msg["time"];
		$reqName = $msg["reqName"];
		$req_head_url = $msg["req_head_url"];
		$res_head_url = $msg["res_head_url"];
		$obj = new AddFriendMsg();
		if($obj->has($reqUid,$resUid)){
			echo $obj->update($reqUid,$resUid,$reqDesc,$remarkName,$time,$reqName);
		}else{
			echo $obj->insrt($reqUid,$resUid,$reqDesc,$remarkName,$time,$reqName,$req_head_url,$res_head_url);			
		}
		
	}




	
?>