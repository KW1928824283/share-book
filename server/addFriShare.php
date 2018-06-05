<?php 
	include_once './table_addfriendsharemsg.php';
	if ($_SERVER["REQUEST_METHOD"] =="POST") {


	}else if ($_SERVER["REQUEST_METHOD"] =="GET") {
		$fun = $_GET["fun"];
		switch ($fun) {
			case 'add':
				$reqUid = $_GET["reqUid"];
				$time = $_GET["time"];
				add($reqUid,$time);
				break;
			case 'remove':
				$reqUid = $_GET["reqUid"];
				$time = $_GET["time"];
				remove($reqUid,$time);
				break;
			case 'has':
				$reqUid = $_GET["reqUid"];
				$time = $_GET["time"];
				// echo $reqUid.$time;
				has($reqUid,$time);
				break;
			default:
				# code...
				break;
		}
		
	}
	function add($reqUid,$time)
	{
		$obj = new addShare();
		echo $obj->insert($reqUid,$time);
	}

	function has($reqUid,$time)
	{
		
		$obj = new addShare();
		echo $obj->has($reqUid,$time);
	}
	function remove($reqUid,$time)
	{
		$obj = new addShare();
		echo $obj->delete($reqUid,$time);
	}
 ?>