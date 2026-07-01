//<?php

//namespace App\Services\TerminalCommand;

//use App\Dto\Request\TerminalCommandRequest;
//use App\Entity\TerminalCommand;
//use App\Models\TerminalCommandModel;
//use RuntimeException;

//final class TerminalCommandUpdaterService
//{
  //  private TerminalCommandModel $model;
//
  //  public function __construct() { $this->model = new TerminalCommandModel(); }

  //  public function update(int $id, TerminalCommandRequest $request): object
  //  {
  //      $existing = $this->model->find($id);
  //      if (!$existing) throw new RuntimeException("Comando no encontrado", 404);
//
   //     $entity = new TerminalCommand(
   //         $id,
   //         $request->command,
  //          $request->description,
  //          $request->output_type,
 //           $request->payload,
    //        $request->is_active ?? true,
 //           $request->sort_order ?? 0,
  //          new \DateTime($existing->created_at),
  //          new \DateTime()
  //      );
//
 //       $this->model->update($entity);
 //       return $this->model->find($id);
 //   }
//}