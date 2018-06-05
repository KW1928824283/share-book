<?php
	include_once './table_user.php';
	if ($_SERVER["REQUEST_METHOD"] =="POST") {
		$fun = $_POST["fun"];
		switch ($fun) {
			case 'Register':
				$uid = $_POST['uid'];
				$password = $_POST['password'];
				$nickName = $_POST['nickName'];
				$head_url = $_POST["head_url"];
				Register($uid,$password,$nickName,$head_url);
				break;
			case 'Login':
				$uid = $_POST['uid'];
				$password = $_POST['password'];
				Login($uid,$password);
				break;
			case 'SearchFriend':
           		$searchId = $_POST["searchId"]; 
				SearchFriend($searchId);
				break;
			default:
				# code...
				break;
		}
	}else if($_SERVER['REQUEST_METHOD'] == "GET"){

		// $fun = $_GET["fun"];
		// switch ($fun) {
		// 	case 'value':
		// 		# code...
		// 		break;
			
		// 	default:
		// 		# code...
		// 		break;
		// }
	}
	function Login($uid,$password)
	{
		$obj = new User();
		$return = $obj->findOneMsg($uid,$password);
		if($return == ""){
			echo false;
		}else{
			echo json_encode($return);
		}
	}
	function Register($uid,$password,$nickName,$head_url)
	{
			$obj = new User();
			$return = $obj->insertOne($uid,$password,$nickName,$head_url);
			echo $return;
			
	}
	function SearchFriend($searchId)
	{
		$obj = new User();
		$return = $obj->searchFri($searchId);
		echo json_encode($return);
	}
?>